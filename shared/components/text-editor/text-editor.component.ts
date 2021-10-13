import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, combineLatest, EMPTY, fromEvent, merge, Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, map, mapTo, startWith, switchMap } from 'rxjs/operators';
import { ControlValueAccessor } from '@ngneat/reactive-forms';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { svgDelete } from '../../svg-icons/delete';
import { getNodeRect, getPlainText } from '../../utils/html';
import { observeResize } from '../../utils/observe-resize';

@UntilDestroy()
@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TextEditorComponent,
      multi: true,
    },
  ],
})
export class TextEditorComponent extends ControlValueAccessor<string> implements OnInit {
  @Input() public imageSource: Observable<string>;

  @Input() public ignoreSelectionReset: HTMLElement[] = [];

  @Input() public placeholder: string;

  @Input() public testId: string;

  @Output() public readonly cursorPositionTopChange: EventEmitter<number | undefined> = new EventEmitter();

  @ViewChild('editor', { static: true }) public readonly editor: ElementRef<HTMLElement>;

  public images: HTMLImageElement[];

  public value: string;

  private readonly selectionRange$: BehaviorSubject<Range> = new BehaviorSubject(void 0);

  private value$: BehaviorSubject<string> = new BehaviorSubject('');

  private get editorElement(): HTMLElement {
    return this.editor.nativeElement;
  }

  private get nativeElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private elementRef: ElementRef,
    private svgIconRegistry: SvgIconRegistry,
    @Inject(DOCUMENT) private document: Document,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgDelete,
    ]);

    this.value$.pipe(
      filter((value) => value !== this.editorElement.innerHTML),
      untilDestroyed(this),
    ).subscribe((value) => {
      this.value = value;
      this.changeDetectorRef.detectChanges();
    });

    this.listenSelectionRange().pipe(
      untilDestroyed(this),
    ).subscribe(this.selectionRange$);

    this.listenCursorPositionTop().pipe(
      untilDestroyed(this),
    ).subscribe((y) => this.cursorPositionTopChange.emit(y));

    this.listenImageSource().pipe(
      untilDestroyed(this),
    ).subscribe((image) => {
      this.insertElementAtSelection(image);
    });

    this.listenImages().pipe(
      untilDestroyed(this),
    ).subscribe((images) => {
      this.images = images;
      this.changeDetectorRef.detectChanges();
    });

    fromEvent(this.nativeElement, 'click').pipe(
      untilDestroyed(this),
    ).subscribe(() => this.editorElement.focus());
  }

  public writeValue(value: string): void {
    if (this.value$.value === value) {
      return;
    }

    this.value$.next(value || '');
    this.changeDetectorRef.detectChanges();
  }

  public onBlur(): void {
    this.onTouched();
  }

  public onPaste(event: ClipboardEvent): void {
    event.stopPropagation();
    event.preventDefault();

    const text = event.clipboardData.getData('text/plain');

    const purifiedText = getPlainText(text);

    if (!purifiedText.length) {
      return;
    }

    document.execCommand('insertHTML', false, purifiedText);
  }

  public onInput(): void {
    this.emitValueChange();
  }

  public removeImage(image: HTMLImageElement): void {
    image.remove();
    this.selectionRange$.next(null);
    this.emitValueChange();
  }

  private listenCursorPositionTop(): Observable<number | undefined> {
    return combineLatest([
      this.selectionRange$,
      this.value$,
      observeResize(this.editorElement).pipe(
        startWith(0),
      ),
    ]).pipe(
      map(([range]) => range),
      map((range) => {
        const elementRect = this.nativeElement.getBoundingClientRect();

        if (!range) {
          return this.editorElement.getBoundingClientRect().height;
        }

        const selectionRect = this.getSelectionRect(range);

        const addHeight = range.endContainer.nodeType !== 3 && range.endOffset;

        return selectionRect.top + (addHeight ? selectionRect.height : 0) - elementRect.top;
      }),
    );
  }

  private listenImages(): Observable<HTMLImageElement[]> {
    return this.value$.pipe(
      distinctUntilChanged(),
      map(() => Array.from(this.editorElement.querySelectorAll('img'))),
      switchMap((images) => images.length
        ? combineLatest(images.map((image) => image.complete
          ? of(image)
          : fromEvent(image, 'load').pipe(
            mapTo(image),
            startWith(0),
          )
        ))
        : of([])
      ),
      map((images) => images.filter(Boolean)),
    );
  }

  private listenImageSource(): Observable<HTMLImageElement> {
    return (this.imageSource || EMPTY).pipe(
      map((imageSrc) => {
        const image = document.createElement('img');
        image.src = imageSrc;
        return image;
      }),
    );
  }

  private listenSelectionRange(): Observable<Range> {
    const rangeSet$ = merge(
      this.value$,
      fromEvent(document, 'selectionchange')
    ).pipe(
      filter(() => document.activeElement === this.editorElement),
      map(() => document.getSelection().getRangeAt(0)),
    );

    const rangeReset$ = fromEvent(document, 'click').pipe(
      filter((event: MouseEvent) => {
        const target = event.target as HTMLElement;
        return !this.nativeElement.contains(target)
          && this.ignoreSelectionReset.every((elem) => !elem.parentElement.contains(target));
      }),
      mapTo(null),
    );

    return merge(
      rangeSet$,
      rangeReset$,
    );
  }

  private insertElementAtSelection(node: Node): void {
    const selectionRange = this.selectionRange$.value;
    if (selectionRange) {
      selectionRange.deleteContents();
      selectionRange.insertNode(node);

      const nextSibling = node.nextSibling as HTMLElement;
      if (nextSibling?.tagName === 'BR') {
        nextSibling.remove();
      }

      this.selectionRange$.next(undefined);
    } else {
      this.editorElement.appendChild(node);
    }

    this.emitValueChange();
  }

  private getSelectionRect(range: Range): DOMRect {
    const selectionRect = range.getBoundingClientRect();

    if (selectionRect.bottom > 0) {
      return selectionRect;
    }

    if (range.endContainer.nodeType !== 3 && range.startOffset) {
      return getNodeRect(range.startContainer.childNodes[range.startOffset - 1] || range.endContainer);
    }

    return getNodeRect(range.endContainer);
  }

  private emitValueChange(): void {
    const html = this.editorElement.innerHTML;
    this.value$.next(html);
    this.onChange(html);
  }
}

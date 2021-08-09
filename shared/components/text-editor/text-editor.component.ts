import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, fromEvent, Observable, Subject } from 'rxjs';
import { filter, map, startWith, tap } from 'rxjs/operators';
import { ControlValueAccessor } from '@ngneat/reactive-forms';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { svgDelete } from '../../svg-icons/delete';
import { removeExtraBlankLines } from './text-editor.utils';

@UntilDestroy()
@Component({
  selector: 'app-text-editor',
  templateUrl: 'text-editor.component.html',
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
  @Input() public ignoreSelectionReset: HTMLElement[];

  @Output() public readonly cursorPositionTopChange: EventEmitter<number | undefined> = new EventEmitter();

  @ViewChild('editorContainer', { static: true }) public editorContainerRef: ElementRef<HTMLDivElement>;

  @HostBinding('class.post-content') public hasPostContentClass = true;

  public images$: Observable<HTMLImageElement[]>;

  private selectionRange: BehaviorSubject<Range> = new BehaviorSubject(void 0);

  private valueAssigned$: Subject<void> = new Subject();

  public get element(): HTMLElement {
    return this.editorContainerRef.nativeElement;
  }

  constructor(
    private svgIconRegistry: SvgIconRegistry,
  ) {
    super();
  }

  public ngOnInit(): void {
    fromEvent(this.element, 'change').subscribe(console.log);
    this.svgIconRegistry.register([
      svgDelete,
    ]);

    this.listenSelectionRange().pipe(
      untilDestroyed(this),
    ).subscribe((selectionRange) => {
      this.selectionRange.next(selectionRange);
      this.emitValue();
    });

    this.listenCursorPositionTop().pipe(
      untilDestroyed(this),
    ).subscribe((y) => this.cursorPositionTopChange.emit(y));

    if (this.imageSource) {
      this.listenImagePaste(this.imageSource).pipe(
        untilDestroyed(this),
      ).subscribe((image) => {
        this.insertElementAtSelection(image);
        removeExtraBlankLines(this.element);
      });
    }

    this.images$ = this.listenImages();

    fromEvent(this.element, 'input').pipe(
      untilDestroyed(this),
    ).subscribe(() => removeExtraBlankLines(this.element));

    fromEvent(this.element, 'input').pipe(
      untilDestroyed(this),
    ).subscribe(() => this.emitValue());
  }

  public removeImage(image: HTMLImageElement): void {
    image.remove();
    this.emitValue();
  }

  public writeValue(value: string): void {
    this.element.innerHTML = value;
    this.valueAssigned$.next();
  }

  @HostListener('blur')
  public onBlur(): void {
    this.onTouched();
    removeExtraBlankLines(this.element, true);
  }

  @HostListener('paste', ['$event'])
  public onPaste(event: ClipboardEvent): void {
    event.stopPropagation();
    event.preventDefault();

    const text = event.clipboardData.getData('text/plain');

    if (!text.length) {
      return;
    }

    document.execCommand('insertHTML', false, text);
  }

  private listenCursorPositionTop(): Observable<number | undefined> {
    return this.selectionRange.pipe(
      map((range) => {
        if (!range) {
          return undefined;
        }

        const selectionRect = range.getBoundingClientRect();

        const correctedRect = selectionRect.bottom > 0
          ? selectionRect
          : (range.endContainer as HTMLElement).getBoundingClientRect();

        const elementRect = this.element.getBoundingClientRect();

        return correctedRect.top - elementRect.top;
      }),
    );
  }

  private listenImagePaste(imageSrc: Observable<string>): Observable<HTMLImageElement> {
    return imageSrc.pipe(
      map((imageSrc) => {
        const image = document.createElement('img');
        image.src = imageSrc;
        return image;
      }),
    );
  }

  private listenImages(): Observable<HTMLImageElement[]> {
    return this.valueAssigned$.pipe(
      startWith(void 0),
      map(() => Array.from(this.element.querySelectorAll('img'))),
      tap(console.log)
    );
  }

  private listenSelectionRange(): Observable<Range> {
    return fromEvent(document, 'selectionchange').pipe(
      filter(() => document.activeElement === this.element),
      map(() => document.getSelection().getRangeAt(0)),
    );
  }

  private insertElementAtSelection(node: HTMLElement): void {
    if (this.selectionRange.value) {
      this.selectionRange.value.deleteContents();
      this.selectionRange.value.insertNode(node);
    } else {
      this.element.appendChild(node);
    }

    this.emitValue();
  }

  private emitValue(): void {
    this.valueAssigned$.next();
    this.onChange(this.element.innerHTML);
  }
}

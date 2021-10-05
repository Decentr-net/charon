import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output, ViewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { combineLatest, fromEvent, merge, Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, map, mapTo, startWith, switchMap, switchMapTo, takeUntil } from 'rxjs/operators';
import { ControlValueAccessor, FormControl } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { QuillEditorComponent, Range as QuillRange, SelectionChange } from 'ngx-quill';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgDelete } from '@shared/svg-icons/delete';

@UntilDestroy()
@Component({
  selector: 'app-hub-post-text-editor',
  templateUrl: './hub-post-text-editor.component.html',
  styleUrls: ['./hub-post-text-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: HubPostTextEditorComponent,
      multi: true,
    },
  ],
})
export class HubPostTextEditorComponent extends ControlValueAccessor<string> implements OnInit {
  @Input() public imageSource: Observable<string>;
  @Input() public ignoreSelectionReset: HTMLElement[];

  @Output() public readonly cursorPositionTopChange: EventEmitter<number> = new EventEmitter();

  @ViewChild(QuillEditorComponent) public quillEditorComponent: QuillEditorComponent;

  public quillControl: FormControl<string> = new FormControl('');

  private quillEditorElement: HTMLElement;
  private quillEditorInstance: any;

  private selectionRange: QuillRange;

  public images: HTMLImageElement[];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private elementRef: ElementRef<HTMLElement>,
    private svgIconRegistry: SvgIconRegistry,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgDelete,
    ]);

    fromEvent(document, 'click').pipe(
      filter((event) => {
        return ![this.elementRef.nativeElement, ...this.ignoreSelectionReset || []]
          .some(element => element.contains(event.target as Node));
      }),
      untilDestroyed(this),
    ).subscribe(() => this.selectionRange = undefined);

    if (this.imageSource) {
      this.imageSource.pipe(
        untilDestroyed(this),
      ).subscribe((imageSrc) => this.addImage(imageSrc));
    }

    this.quillControl.value$.pipe(
      untilDestroyed(this),
    ).subscribe((value) => this.onChange(value || ''));
  }

  public onEditorCreated(quill: any): void {
    this.quillEditorElement = quill.root;
    this.quillEditorInstance = quill.editor;

    this.disableImagesPaste(quill.root);
    this.initCursorPositionTopTracker(quill.root);
    this.listenImages(quill.root);
    this.removeFormattingOnPaste(quill);
  }

  public onSelectionChanged({ range }: SelectionChange): void {
    if (range) {
      this.selectionRange = range;
    }
  }

  public removeImage(image: HTMLImageElement): void {
    image.remove();
  }

  public writeValue(value: string): void {
    this.quillControl.setValue(value);
  }

  private addImage(imageSrc: string): void {
    const insertIndex = this.selectionRange?.index || this.quillEditorComponent.quillEditor.getLength();

    this.quillEditorInstance.deleteText(insertIndex, this.selectionRange?.length || 0);
    this.quillEditorInstance.insertEmbed(insertIndex, 'image', imageSrc);

    this.quillControl.setValue(this.quillEditorElement.innerHTML);

    this.quillEditorComponent.quillEditor.setSelection(insertIndex + 1);
  }

  private disableImagesPaste(element: HTMLElement): void {
    fromEvent<ClipboardEvent>(element, 'paste').pipe(
      untilDestroyed(this),
    ).subscribe((event) => {
      event.stopPropagation();
      event.preventDefault();

      const text = event.clipboardData.getData('text/plain');

      if (!text.length) {
        return;
      }

      document.execCommand('insertHTML', false, text);
    });
  }

  private initCursorPositionTopTracker(quillElement: HTMLElement): void {
    merge(
      fromEvent(quillElement, 'selectstart'),
      fromEvent(quillElement, 'keydown'),
    ).pipe(
      switchMapTo(fromEvent(document, 'selectionchange').pipe(
        takeUntil(fromEvent(quillElement, 'blur')),
      )),
      map(() => document.getSelection().getRangeAt(0)),
      filter(Boolean),
      map((range: Range) => {
        const selectionRect = range.getBoundingClientRect();
        const quillElementRect = this.quillEditorElement.getBoundingClientRect();

        return selectionRect.bottom > 0
          ? selectionRect.top - quillElementRect.top
          : quillElementRect.height - parseInt(getComputedStyle(this.quillEditorElement).lineHeight, 10);
      }),
      distinctUntilChanged(),
      untilDestroyed(this),
    ).subscribe((y) => this.cursorPositionTopChange.emit(y));
  }

  private listenImages(quillElement: HTMLElement): void {
    this.quillControl.value$.pipe(
      map(() => Array.from(quillElement.querySelectorAll('img'))),
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
      untilDestroyed(this),
    ).subscribe((images) => {
      this.images = images;
      this.changeDetectorRef.markForCheck();
    });
  }

  private removeFormattingOnPaste(quill: any): void {
    quill.clipboard.addMatcher(Node.ELEMENT_NODE, ({}, delta) => {
      delta.forEach(e => e.attributes = undefined);
      return delta;
    });
  }
}

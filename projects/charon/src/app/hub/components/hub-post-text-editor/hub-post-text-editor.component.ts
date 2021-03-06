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
import { fromEvent, merge, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMapTo, takeUntil } from 'rxjs/operators';
import { ControlValueAccessor, FormControl } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { QuillEditorComponent, Range as QuillRange, SelectionChange } from 'ngx-quill';

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

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private elementRef: ElementRef<HTMLElement>,
  ) {
    super();
  }

  public ngOnInit(): void {
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
    this.removeFormattingOnPaste(quill);
  }

  public onSelectionChanged({ range }: SelectionChange): void {
    if (range) {
      this.selectionRange = range;
    }
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
      const items = event.clipboardData.items;

      if (!items?.length) {
        return;
      }

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') > -1) {
          event.preventDefault();
          break;
        }
      }
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
          : quillElementRect.height - parseInt(getComputedStyle(this.quillEditorElement).lineHeight);
      }),
      distinctUntilChanged(),
      untilDestroyed(this),
    ).subscribe((y) => this.cursorPositionTopChange.emit(y));
  }

  private removeFormattingOnPaste(quill: any): void {
    quill.clipboard.addMatcher(Node.ELEMENT_NODE, ({}, delta) => {
      delta.forEach(e => e.attributes = undefined);
      return delta;
    });
  }
}

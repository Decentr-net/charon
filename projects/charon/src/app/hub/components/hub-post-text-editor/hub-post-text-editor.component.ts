import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ControlValueAccessor, FormControl } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Range, SelectionChange } from 'ngx-quill';

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

  public quillControl: FormControl<string> = new FormControl('');

  private quillEditorElement: HTMLElement;
  private quillEditorInstance: any;

  private selectionRange: Range;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private elementRef: ElementRef,
  ) {
    super();
  }

  public ngOnInit(): void {
    fromEvent(document, 'click').pipe(
      filter((event) => {
        return ![this.elementRef.nativeElement, ...this.ignoreSelectionReset || []]
          .some(element => element.contains(event.target));
      }),
      untilDestroyed(this),
    ).subscribe(() => this.selectionRange = undefined);

    if (this.imageSource) {
      this.imageSource.pipe(
        untilDestroyed(this),
      ).subscribe((imageSrc) => this.addImage(imageSrc));
    }
  }

  public onEditorCreated(quill: any): void {
    this.quillEditorElement = quill.root;
    this.quillEditorInstance = quill.editor;

    this.disableImagesPaste(quill.root);
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
    if (this.selectionRange) {
      this.quillEditorInstance.deleteText(this.selectionRange.index, this.selectionRange.length);
      this.quillEditorInstance.insertEmbed(this.selectionRange.index, 'image', imageSrc);
      this.quillControl.setValue(this.quillEditorElement.innerHTML);
    } else {
      const img = document.createElement('img');
      img.src = imageSrc;
      this.quillControl.setValue((this.quillControl.value || '') + img.outerHTML);
    }

    this.onChange(this.quillControl.value);
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

  private removeFormattingOnPaste(quill: any): void {
    quill.clipboard.addMatcher(Node.ELEMENT_NODE, ({}, delta) => {
      delta.forEach(e => e.attributes = undefined);
      return delta;
    });
  }
}

import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { ControlValueAccessor } from '@ngneat/reactive-forms';

import { svgAddImage } from '@shared/svg-icons';

@Component({
  selector: 'app-hub-simple-text-editor',
  templateUrl: './hub-simple-text-editor.component.html',
  styleUrls: ['./hub-simple-text-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: HubSimpleTextEditorComponent,
      multi: true,
    },
  ],
})
export class HubSimpleTextEditorComponent extends ControlValueAccessor<string> {
  @ViewChild('textContainer', { static: true }) public textContainer: ElementRef<HTMLDivElement>;

  constructor(svgIconRegistry: SvgIconRegistry) {
    super();

    svgIconRegistry.register(svgAddImage);
  }

  private get textContainerElement(): HTMLDivElement {
    return this.textContainer.nativeElement;
  }

  public addImage(): void {
    const imageSrc = prompt('Enter image url');

    const img = document.createElement('img');
    img.src = imageSrc;

    this.appendText(img.outerHTML);
  }

  public onTextInput(): void {
    this.onChange(this.textContainerElement.innerHTML);
  }

  public writeValue(value: string) {
    this.textContainerElement.innerHTML = value;
  }

  private appendText(text: string): void {
    this.textContainerElement.innerHTML += text;
    this.onTextInput();
  }
}

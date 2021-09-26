import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Optional,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy } from '@ngneat/until-destroy';

import { svgEyeCrossed } from '../../../svg-icons/eye-crossed';
import { svgEye } from '../../../svg-icons/eye';
import { BrowserType, detectBrowser } from '../../../utils/browser';
import { SubmitSourceDirective } from '../../../directives/submit-source';
import { InputContainerControl } from '../../input-container';
import { CustomControl } from '../custom-control';

@UntilDestroy()
@Component({
  selector: 'app-input',
  styleUrls: ['./input.component.scss'],
  templateUrl: './input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: InputContainerControl,
      useExisting: InputComponent,
    },
  ],
})
export class InputComponent extends CustomControl<string> implements OnInit {
  @Input() public rows = 1;

  @Input() public type: 'text' | 'password' = 'text';

  @Input() public eye = true;

  @Input() public placeholder: string;

  @Input() public maxlength = -1;

  @ViewChild('inputElement') public inputElement: ElementRef<HTMLElement>;
  @ViewChild('textareaElement') public textareaElement: ElementRef<HTMLElement>;

  @HostBinding('class.typeface-paragraph')
  public typefaceParagraph = true;

  public valueSecured = true;

  private isFocused: boolean;

  private readonly browser = detectBrowser();

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    elementRef: ElementRef<HTMLElement>,
    ngControl: NgControl,
    renderer2: Renderer2,
    private svgIconRegistry: SvgIconRegistry,
    @Optional() submitSource: SubmitSourceDirective,
  ) {
    super(
      changeDetectorRef,
      elementRef,
      ngControl,
      renderer2,
      submitSource,
    );
  }

  public get useTextArea(): boolean {
    return this.rows > 1 && !(this.browser === BrowserType.Firefox && this.type === 'password' && this.valueSecured);
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgEye,
      svgEyeCrossed,
    ]);

    this.init();
  }

  @HostListener('click')
  public onClick(): void {
    if (this.isFocused || this.isDisabled) {
      return;
    }

    (this.inputElement || this.textareaElement).nativeElement.focus();
  }

  public onFocus(): void {
    this.isFocused = true;
  }

  public onBlur(): void {
    this.isFocused = false;
    this.onTouched();
  }

  public onEyeClick(): void {
    this.valueSecured = !this.valueSecured;
  }

  public onValueChange(newValue: string): void {
    this.value = newValue;
    this.onChange(this.value);
  }
}

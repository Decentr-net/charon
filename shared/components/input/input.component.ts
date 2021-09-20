import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ControlValueAccessor } from '@ngneat/reactive-forms';
import { NgControl } from '@angular/forms';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { svgEyeCrossed } from '../../svg-icons/eye-crossed';
import { svgEye } from '../../svg-icons/eye';
import { BrowserType, detectBrowser, isOpenedInTab } from '../../utils/browser';

@UntilDestroy()
@Component({
  selector: 'app-input',
  styleUrls: ['./input.component.scss'],
  templateUrl: './input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent extends ControlValueAccessor<string> implements OnInit {
  @Input() public rows = 1;

  @Input() public type: 'text' | 'password' = 'text';

  @Input() public eye = true;

  @Output() public touched: EventEmitter<void> = new EventEmitter();

  @HostBinding('class.is-disabled')
  public isDisabled = false;

  @HostBinding('class.typeface-paragraph')
  public typefaceParagraph = true;

  public isOpenedInPopup: boolean = !isOpenedInTab();

  public value: string;

  @HostBinding('class.is-empty')
  public get empty(): boolean {
    return !this.value;
  }

  public valueSecured = true;

  private readonly browser = detectBrowser();

  constructor(
    private ngControl: NgControl,
    private changeDetectorRef: ChangeDetectorRef,
    private svgIconRegistry: SvgIconRegistry,
  ) {
    super();

    ngControl.valueAccessor = this;
  }

  @HostBinding('class.is-invalid')
  public get invalid(): boolean {
    return this.ngControl.invalid;
  }

  @HostBinding('class.is-touched')
  public get isTouched(): boolean {
    return this.ngControl.touched;
  }

  public get useTextArea(): boolean {
    return this.rows > 1 && !(this.browser === BrowserType.Firefox && this.type === 'password');
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgEye,
      svgEyeCrossed,
    ]);

    this.ngControl.statusChanges.pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });
  }

  public onEyeClick(): void {
    this.valueSecured = !this.valueSecured;
  }

  public onValueChange(newValue: string): void {
    this.value = newValue;
    this.onChange(this.value);
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = () => {
      fn();
      this.touched.emit();
    };
  }

  public writeValue(value: string): void {
    this.value = value;
    this.changeDetectorRef.markForCheck();
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.changeDetectorRef.detectChanges();
  }
}

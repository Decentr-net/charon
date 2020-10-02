import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Host,
  Input,
  Optional,
  SkipSelf
} from '@angular/core';
import { AbstractControl, ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { noop } from 'rxjs';
import { MatFormFieldAppearance } from '@angular/material/form-field/form-field';
import { LocalControlErrorStateMatcher } from '@shared/providers/local-control-error-state-matcher';
import { AddSeparatorToDate } from '@shared/utils/form-value';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateInputComponent implements AfterViewInit, ControlValueAccessor {

  matcher: ErrorStateMatcher;
  value: string;

  protected propagateChange: (_: any) => void = noop;
  protected propagateTouch: () => void = noop;

  @Input() formControlName: string;
  @Input() appearance: MatFormFieldAppearance;
  @Input() className: string;

  constructor(@Optional() @Host() @SkipSelf() private controlContainer: ControlContainer) {
  }

  ngAfterViewInit() {
    if (this.controlContainer && this.formControlName) {
      const control = this.controlContainer.control.get(this.formControlName);

      this.matcher = new LocalControlErrorStateMatcher(control);
    }
  }

  public onChange() {
    this.value = this.onKeyDateInput();

    this.propagateChange(this.value);
    this.propagateTouch();
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouch = fn;
  }

  private onKeyDateInput() {
    return AddSeparatorToDate(this.value, '-');
  }
}

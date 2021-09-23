import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit, Optional } from '@angular/core';
import { ControlValueAccessor } from '@ngneat/reactive-forms';
import { FormGroupDirective, NgControl } from '@angular/forms';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { svgCheck } from '../../svg-icons/check';
import { EMPTY, merge } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-checkbox',
  styleUrls: ['./checkbox.component.scss'],
  templateUrl: './checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent extends ControlValueAccessor<boolean> implements OnInit {
  @HostBinding('class.is-disabled')
  public isDisabled = false;

  public value: boolean;

  constructor(
    @Optional() private form: FormGroupDirective,
    private changeDetectorRef: ChangeDetectorRef,
    private ngControl: NgControl,
    private svgIconRegistry: SvgIconRegistry,
  ) {
    super();

    this.ngControl.valueAccessor = this;
  }

  @HostBinding('class.is-invalid')
  public get invalid(): boolean {
    return this.ngControl.invalid;
  }

  @HostBinding('class.is-touched')
  public get isTouched(): boolean {
    return this.ngControl.touched;
  }

  @HostBinding('class.is-submitted')
  public get isSubmitter(): boolean {
    return this.form?.submitted;
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgCheck,
    ]);

    merge(
      this.ngControl.statusChanges,
      this.form?.statusChanges || EMPTY,
    ).pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });
  }

  public toggle(): void {
    this.value = !this.value;
    this.onChange(this.value);

    this.onTouched();
  }

  public writeValue(value: boolean): void {
    this.value = value;
    this.changeDetectorRef.markForCheck();
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.changeDetectorRef.detectChanges();
  }
}

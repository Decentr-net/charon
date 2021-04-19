import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnInit } from '@angular/core';
import { ControlContainer, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ControlValueAccessor } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-transfer-input',
  templateUrl: './transfer-input.component.html',
  styleUrls: ['./transfer-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TransferInputComponent,
      multi: true,
    },
  ],
})
export class TransferInputComponent
  extends ControlValueAccessor<string | number>
  implements OnInit
{
  @Input() public formControlName: string;
  @Input() public rows: number = 1;

  @HostBinding('class.is-disabled')
  public isDisabled: boolean = false;

  public control: FormControl;

  public value: string | number;

  constructor(
    private ngControl: ControlContainer,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super();
  }

  @HostBinding('class.is-invalid')
  public get invalid(): boolean {
    return this.control?.invalid;
  }

  @HostBinding('class.is-touched')
  public get isTouched(): boolean {
    return this.control?.touched;
  }

  public ngOnInit(): void {
    this.control = this.ngControl.control.get(this.formControlName) as FormControl;

    this.control.statusChanges.pipe(
      debounceTime(100),
      untilDestroyed(this),
    ).subscribe(() => {
      this.changeDetectorRef.detectChanges();
    });
  }

  public onValueChange(newValue: string | number): void {
    this.onChange(newValue);
  }

  public writeValue(value: string | number): void {
    this.value = value;
    this.changeDetectorRef.markForCheck();
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}

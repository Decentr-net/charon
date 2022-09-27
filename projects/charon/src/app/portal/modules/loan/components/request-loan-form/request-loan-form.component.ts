import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import {
  FormGroupType,
  RequestLoanFormControlName,
  RequestLoanFormControlValue,
} from './request-loan-form.definitions';
import { TranslationsConfig } from '@shared/components/profile-form/profile-form.definitions';
import { RequestLoanFormModel } from './request-loan-form-model';
import { ControlValueAccessor } from '@ngneat/reactive-forms';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-request-loan-form',
  templateUrl: './request-loan-form.component.html',
  styleUrls: ['./request-loan-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RequestLoanFormComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: RequestLoanFormComponent,
      multi: true,
    },
    {
      provide: RequestLoanFormModel,
      useClass: RequestLoanFormModel,
    },
  ],
})

export class RequestLoanFormComponent extends ControlValueAccessor<RequestLoanFormControlValue> implements OnInit, Validator {

  @Input() public translationsConfig: TranslationsConfig;

  public readonly form: FormGroupType;

  public readonly controlName: typeof RequestLoanFormControlName = RequestLoanFormControlName;

  constructor(
    private formModel: RequestLoanFormModel,
  ) {
    super();
    this.form = formModel.createForm();
  }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(() => this.onChange(this.getOuterValue()));
  }

  public writeValue(value: RequestLoanFormControlValue): void {
    this.formModel.patchForm(this.form, value, { emitEvent: true });
  }

  public validate(): ValidationErrors | null {
    if (this.form.invalid) {
      return {
        invalid: true,
      };
    }

    return null;
  }

  private getOuterValue(): RequestLoanFormControlValue {
    return this.formModel.getOuterValue(this.form);
  }

}

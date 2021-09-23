import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

import { PasswordValidationUtil } from '../../utils/validation';
import { PasswordForm, TranslationsConfig } from './password-form.definitions';

@UntilDestroy()
@Component({
  selector: 'app-password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PasswordFormComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordFormComponent,
      multi: true,
    },
  ],
})
export class PasswordFormComponent extends ControlValueAccessor<string> implements OnInit, Validator {
  @Input() public translationsConfig: TranslationsConfig;

  @Input() public required = false;

  public form: FormGroup<PasswordForm>;

  constructor(
    private formBuilder: FormBuilder,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.form = this.createForm();

    this.form.valueChanges.pipe(
      untilDestroyed(this),
    ).subscribe((formValue) => {
      this.form.valid ? this.onChange(formValue.password) : this.onChange('');
    });
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    if (this.form.invalid) {
      return {
        invalid: true,
      };
    }

    return null;
  }

  public writeValue({}: string): void {
    return;
  }

  private createForm(): FormGroup<PasswordForm> {
    return this.formBuilder.group({
      confirmPassword: [
        '',
        [
          ...this.required ? [Validators.required] : [],
          RxwebValidators.compare({ fieldName: 'password' }),
        ],
      ],
      password: [
        '',
        [
          ...this.required ? [Validators.required] : [],
          Validators.minLength(8),
          PasswordValidationUtil.validatePasswordStrength,
        ],
      ],
    });
  }
}

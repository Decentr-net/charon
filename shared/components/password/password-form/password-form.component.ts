import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators
} from '@angular/forms';
import { ControlsOf, ControlValueAccessor, FormBuilder, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

import { PASSWORD_VALIDATION, PasswordTranslationsConfig } from '../password.definitions';

export interface PasswordForm {
  password: string;
  confirmPassword: string;
}

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
  @Input() public translationsConfig: PasswordTranslationsConfig;

  @Input() public required = false;

  public form: FormGroup<ControlsOf<PasswordForm>>;

  constructor(
    private formBuilder: FormBuilder,
  ) {
    super();
  }

  public get passwordControl(): FormControl<string> {
    return this.form?.get('password');
  }

  public ngOnInit(): void {
    this.form = this.createForm();

    this.passwordControl.valueChanges.pipe(
      untilDestroyed(this),
    ).subscribe(() => this.form.get('confirmPassword').updateValueAndValidity({ onlySelf: true }));

    this.form.valueChanges.pipe(
      untilDestroyed(this),
    ).subscribe((formValue) => {
      this.onChange(formValue.password);
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

  private createForm(): FormGroup<ControlsOf<PasswordForm>> {
    return this.formBuilder.group({
      confirmPassword: [
        '',
        [
          RxwebValidators.compare({ fieldName: 'password' }),
        ],
      ],
      password: [
        '',
        [
          ...this.required ? [Validators.required] : [],
          RxwebValidators.password({
            validation: PASSWORD_VALIDATION,
          }),
        ],
      ],
    });
  }
}

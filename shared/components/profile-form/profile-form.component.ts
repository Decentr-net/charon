import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { AbstractControl, ControlValueAccessor, FormArray, FormGroup } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Gender } from 'decentr-js';

import { ProfileFormModel } from './profile-form-model';
import {
  ArrayControlName,
  EmailForm,
  ProfileForm,
  ProfileFormControlName,
  ProfileFormControlValue,
  TranslationsConfig,
  UsernameForm,
} from './profile-form.definitions';

@UntilDestroy()
@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ProfileFormComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: ProfileFormComponent,
      multi: true,
    },
  ],
})
export class ProfileFormComponent extends ControlValueAccessor<ProfileFormControlValue> implements OnInit, Validator {
  @Input() public translationsConfig: TranslationsConfig;

  public readonly form: FormGroup<ProfileForm>;

  public readonly gender: typeof Gender = Gender;

  public readonly maxAdditionalEmailsCount: number = 9;
  public readonly maxUsernamesCount: number = 10;

  public readonly controlName: typeof ProfileFormControlName = ProfileFormControlName;

  constructor(
    private formModel: ProfileFormModel,
  ) {
    super();

    this.form = formModel.createForm();
  }

  public get emailFormArray(): FormArray<EmailForm> {
    return this.formModel.getEmailsFormArray(this.form);
  }

  public get usernameFormArray(): FormArray<UsernameForm> {
    return this.formModel.getUsernamesFormArray(this.form);
  }

  public ngOnInit() {
    this.form.value$
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(() => this.onChange(this.getOuterValue()));
  }

  public isArrayControlsLimitExceeded(arrayName: ArrayControlName): boolean {
    switch (arrayName) {
      case ProfileFormControlName.Emails:
        return this.emailFormArray.length >= this.maxAdditionalEmailsCount;
      case ProfileFormControlName.Usernames:
        return this.usernameFormArray.length >= this.maxUsernamesCount;
      default:
        return false;
    }
  }

  public addArrayControl(arrayName: ArrayControlName): void {
    switch (arrayName) {
      case ProfileFormControlName.Emails:
        return this.formModel.addEmail(this.form);
      case ProfileFormControlName.Usernames:
        return this.formModel.addUsername(this.form);
    }
  }

  public removeArrayControl(arrayName: ArrayControlName, index: number): void {
    switch (arrayName) {
      case ProfileFormControlName.Emails:
        return this.formModel.removeEmail(this.form, index);
      case ProfileFormControlName.Usernames:
        return this.formModel.removeUsername(this.form, index);
    }
  }

  public getArrayControl(arrayName: ArrayControlName): FormArray<EmailForm | UsernameForm> {
    switch (arrayName) {
      case ProfileFormControlName.Emails:
        return this.formModel.getEmailsFormArray(this.form);
      case ProfileFormControlName.Usernames:
        return this.formModel.getUsernamesFormArray(this.form);
      default:
        return undefined;
    }
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    if (this.form.invalid) {
      return {
        invalid: true,
      };
    }

    return null;
  }

  public writeValue(value: ProfileFormControlValue) {
    this.formModel.patchForm(this.form, value, { emitEvent: false });
  }

  private getOuterValue(): ProfileFormControlValue {
    return this.formModel.getOuterValue(this.form);
  }
}

import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { FormArray, FormControl, FormGroup, ValidatorFn } from '@ngneat/reactive-forms';

import { BaseValidationUtil } from '../../utils/validation';
import {
  EmailForm,
  ProfileForm,
  ProfileFormControlName,
  ProfileFormControlValue,
  UsernameForm
} from './profile-form.definitions';
import { parseDateValue } from '../date-input';

@Injectable()
export class ProfileFormModel {
  constructor(private datePipe: DatePipe) {
  }

  public getEmailsFormArray(form: FormGroup<ProfileForm>): FormArray<EmailForm> {
    if (!form.controls.emails) {
      form.addControl(ProfileFormControlName.Emails, new FormArray([]))
    }

    return form.controls.emails as FormArray;
  }

  public getUsernamesFormArray(form: FormGroup<ProfileForm>): FormArray<UsernameForm> {
    if (!form.controls.usernames) {
      form.addControl(ProfileFormControlName.Usernames, new FormArray([]));
    }

    return form.controls.usernames as FormArray;
  }

  public addEmail(form: FormGroup<ProfileForm>): void {
    this.getEmailsFormArray(form).push(
      this.createEmailGroup([ProfileFormModel.emailUniqueAdditionalValidator(form)]),
    );
  }

  public addUsername(form: FormGroup<ProfileForm>): void {
    this.getUsernamesFormArray(form).push(this.createUsernameGroup());
  }

  public removeEmail(form: FormGroup<ProfileForm>, index: number): void {
    this.getEmailsFormArray(form).removeAt(index);
  }

  public removeUsername(form, index: number): void {
    this.getUsernamesFormArray(form).removeAt(index);
  }

  public createForm(): FormGroup<ProfileForm> {
    const form = new FormGroup<ProfileForm>({});

    const avatarControl = this.createAvatarControl();
    if (avatarControl) {
      form.addControl(ProfileFormControlName.Avatar, avatarControl);
    }

    // TODO: temporary solution to disable birthday

    const genderControl = this.createGenderControl();
    if (genderControl) {
      form.addControl(ProfileFormControlName.Gender, genderControl);
    }

    const firstNameControl = this.createFirstNameControl();
    if (firstNameControl) {
      form.addControl(ProfileFormControlName.FirstName, firstNameControl);
    }

    const lastNameControl = this.createLastNameControl();
    if (lastNameControl) {
      form.addControl(ProfileFormControlName.LastName, lastNameControl);
    }

    const primaryEmailControl = this.createPrimaryEmailControl();
    if (primaryEmailControl) {
      form.addControl(ProfileFormControlName.PrimaryEmail, primaryEmailControl);
    }

    const usernameControl = this.createUsernameControl();
    if (usernameControl) {
      this.addUsername(form);
    }

    return form;
  }

  public patchForm(
    form: FormGroup<ProfileForm>,
    value: ProfileFormControlValue,
    options?: { emitEvent: boolean },
  ): void {
    const patch: ProfileForm = {
      ...value,
      emails: (value && value.emails || []).map((value) => ({ value })),
      usernames: (value && value.usernames || []).map((value) => ({ value })),
    };

    if (patch.usernames) {
      const usernamesPatchLength = patch.usernames.length;
      const usernamesFormArray = this.getUsernamesFormArray(form);
      while (usernamesFormArray.length !== usernamesPatchLength) {
        if (usernamesFormArray.length > usernamesPatchLength) {
          this.removeUsername(form, usernamesFormArray.length - 1);
        } else {
          this.addUsername(form);
        }
      }
    }

    if (patch.emails) {
      const emailsPatchLength = patch.emails.length;
      const emailsFormArray = this.getEmailsFormArray(form);
      while (emailsFormArray.length !== emailsPatchLength) {
        if (emailsFormArray.length > emailsPatchLength) {
          this.removeEmail(form, emailsFormArray.length - 1);
        } else {
          this.addEmail(form);
        }
      }
    }

    form.patchValue(patch, options);
  }

  public getOuterValue(form: FormGroup<ProfileForm>): ProfileFormControlValue {
    return {
      ...form.value,
      ...form.value.emails
        ? {
          emails: form.value.emails.map(({ value }) => value),
        }
        : undefined,
      ...form.value.usernames
        ? {
          usernames: form.value.usernames.map(({ value }) => value),
        }
        : undefined
    }
  }

  protected createAvatarControl(): FormControl<ProfileForm['avatar']> | undefined {
    return new FormControl(
      null,
      [
      Validators.required,
    ]);
  }

  protected createBirthdayControl(): FormControl<ProfileForm['birthday']> | undefined {
    const prevYearLastDay = new Date(new Date().getFullYear(), 0, 0);

    return new FormControl(
      '',
      [
        Validators.required,
        BaseValidationUtil.isFrDateFormatCorrect,
        BaseValidationUtil.minDate('1901-01-01'),
        BaseValidationUtil.maxDate(this.datePipe.transform(prevYearLastDay, 'yyyy-MM-dd')),
        ProfileFormModel.nonExistentDate(),
      ],
    );
  }

  protected createFirstNameControl(): FormControl<ProfileForm['firstName']> | undefined {
    return new FormControl(
      '',
      [
        Validators.required,
      ],
    );
  }

  protected createLastNameControl(): FormControl<ProfileForm['lastName']> | undefined {
    return new FormControl(
      '',
      [
        Validators.required,
      ],
    );
  }

  protected createGenderControl(): FormControl<ProfileForm['gender']> | undefined {
    return new FormControl(
      null,
      [
        Validators.required,
      ],
    );
  }

  protected createPrimaryEmailControl(): FormControl<ProfileForm['primaryEmail']> | undefined {
    return new FormControl({
      value: '',
      disabled: true,
    });
  }

  protected createEmailControl(additionalValidators?: ValidatorFn[]): FormControl<EmailForm['value']> | undefined {
    return new FormControl(
      '',
      [
        Validators.required,
        RxwebValidators.email(),
        RxwebValidators.unique(),
        ...additionalValidators,
      ],
    );
  }

  protected createUsernameControl(): FormControl<UsernameForm['value']> | undefined {
    return new FormControl(
      '',
      [
        Validators.required,
        Validators.minLength(3),
        RxwebValidators.unique(),
      ],
    );
  }

  private createEmailGroup(additionalEmailValidators?: ValidatorFn[]): FormGroup<EmailForm> | undefined {
    return new FormGroup<EmailForm>({
      [ProfileFormControlName.EmailValue]: this.createEmailControl(additionalEmailValidators),
    });
  }

  private createUsernameGroup(): FormGroup<UsernameForm> | undefined {
    return new FormGroup<UsernameForm>({
      [ProfileFormControlName.UsernameValue]: this.createUsernameControl(),
    });
  }

  protected static emailUniqueAdditionalValidator(form: FormGroup<ProfileForm>): ValidatorFn<string> {
    return (control) => {
      const primaryEmail = form.get(ProfileFormControlName.PrimaryEmail);

      if (primaryEmail
        && primaryEmail.value
        && control.value
        && control.value.toLowerCase() === primaryEmail.value.toLowerCase()
      ) {
        return {
          unique: {},
        };
      }

      return null;
    }
  }

  protected static nonExistentDate(): ValidatorFn<string> {
    return (control) => {
      const parsedDate = parseDateValue(control.value || '');
      const realDate = new Date(control.value);

      if (parsedDate.year !== realDate.getFullYear()
        || parsedDate.month !== realDate.getMonth()
        || parsedDate.day !== realDate.getDate()
      ) {
        return {
          exists: false,
        };
      }

      return null;
    }
  }
}

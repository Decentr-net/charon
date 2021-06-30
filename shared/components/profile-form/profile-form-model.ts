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


  public addEmail(form: FormGroup<ProfileForm>): void {
    this.getEmailsFormArray(form).push(
      this.createEmailGroup(),
    );
  }

  public removeEmail(form: FormGroup<ProfileForm>, index: number): void {
    this.getEmailsFormArray(form).removeAt(index);
  }

  public createForm(): FormGroup<ProfileForm> {
    const form = new FormGroup<ProfileForm>({});

    const avatarControl = this.createAvatarControl();
    if (avatarControl) {
      form.addControl(ProfileFormControlName.Avatar, avatarControl);
    }

    const bioControl = this.createBioControl();
    if (bioControl) {
      form.addControl(ProfileFormControlName.Bio, bioControl);
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

    this.addEmail(form);

    return form;
  }

  public patchForm(
    form: FormGroup<ProfileForm>,
    value: ProfileFormControlValue,
    options?: { emitEvent: boolean },
  ): void {
    const patch: ProfileForm = {
      ...value,
      emails: (value?.emails || []).map((value) => ({ value })),
    };

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

    if (!this.getEmailsFormArray(form).length) {
      this.addEmail(form)
    }

    form.patchValue(patch, options);
  }

  public getOuterValue(form: FormGroup<ProfileForm>): ProfileFormControlValue {
    return {
      ...form.getRawValue(),
      ...form.value.emails
        ? {
          emails: form.value.emails.map(({ value }) => value),
        }
        : undefined,
    }
  }

  protected createAvatarControl(): FormControl<ProfileForm['avatar']> | undefined {
    return new FormControl(
      null,
      [
      Validators.required,
    ]);
  }

  protected createBioControl(): FormControl<ProfileForm['bio']> | undefined {
    return new FormControl(
      null,
      [
        Validators.maxLength(70),
      ],
    );
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

  protected createEmailControl(): FormControl<EmailForm['value']> | undefined {
    return new FormControl(
      '',
      [
        Validators.required,
        RxwebValidators.email(),
        RxwebValidators.unique(),
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

  private createEmailGroup(): FormGroup<EmailForm> | undefined {
    return new FormGroup<EmailForm>({
      [ProfileFormControlName.EmailValue]: this.createEmailControl(),
    });
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

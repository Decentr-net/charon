import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { FormArray, FormControl, FormGroup, ValidatorFn } from '@ngneat/reactive-forms';

import { BaseValidationUtil } from '../../utils/validation';
import { parseDateValue } from '../controls';
import {
  EmailForm,
  ProfileForm,
  ProfileFormControlName,
  ProfileFormControlValue,
} from './profile-form.definitions';

@Injectable()
export class ProfileFormModel {
  protected static nonExistentDate(): ValidatorFn<string> {
    return (control) => {
      const parsedDate = parseDateValue(control.value || '');
      const realDate = new Date(parsedDate.year, parsedDate.month, parsedDate.day);

      if (parsedDate.year !== realDate.getFullYear()
        || parsedDate.month !== realDate.getMonth()
        || parsedDate.day !== realDate.getDate()
      ) {
        return {
          exists: false,
        };
      }

      return null;
    };
  }

  public getEmailsFormArray(form: FormGroup<ProfileForm>): FormArray<EmailForm> {
    if (!form.controls.emails) {
      form.addControl(ProfileFormControlName.Emails, new FormArray([]));
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
    const form = new FormGroup({});

    const avatarControl = this.createAvatarControl();
    if (avatarControl) {
      form.addControl(ProfileFormControlName.Avatar, avatarControl);
    }

    const bioControl = this.createBioControl();
    if (bioControl) {
      form.addControl(ProfileFormControlName.Bio, bioControl);
    }

    const birthdayControl = this.createBirthdayControl();
    if (birthdayControl) {
      form.addControl(ProfileFormControlName.Birthday, birthdayControl);
    }

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
      emails: (value?.emails || []).map((email) => ({ value: email })),
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
      this.addEmail(form);
    }

    form.patchValue(patch, options);
  }

  public getOuterValue(form: FormGroup<ProfileForm>): ProfileFormControlValue {
    return {
      ...form.getRawValue(),
      ...form.getRawValue().emails
        ? {
          emails: form.getRawValue().emails.map(({ value }) => value),
        }
        : undefined,
    };
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
      '',
      [
        Validators.maxLength(70),
      ],
    );
  }

  protected createBirthdayControl(): FormControl<ProfileForm['birthday']> | undefined {
    const dateParseFn = (value) => {
      const dateObj = parseDateValue(value);
      return new Date(dateObj.year, dateObj.month, dateObj.day);
    };

    return new FormControl(
      '',
      [
        Validators.required,
        BaseValidationUtil.minDate(new Date(1901, 0, 1), dateParseFn),
        BaseValidationUtil.maxDate(new Date(new Date().getFullYear(), 0, 0), dateParseFn),
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

  private createEmailGroup(): FormGroup<EmailForm> | undefined {
    return new FormGroup<EmailForm>({
      [ProfileFormControlName.EmailValue]: this.createEmailControl(),
    });
  }
}

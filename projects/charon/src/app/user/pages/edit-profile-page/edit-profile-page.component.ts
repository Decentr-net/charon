import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormArray, FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { finalize } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Gender } from 'decentr-js';

import { UserPrivate } from '@root-shared/services/auth';
import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { BaseValidationUtil, PasswordValidationUtil } from '@shared/utils/validation';
import { AuthService, AuthUserUpdate } from '@core/auth';
import { NotificationService, SpinnerService } from '@core/services';
import { EditProfilePageService } from './edit-profile-page.service';

interface EditProfileForm extends Required<AuthUserUpdate>, Pick<UserPrivate, 'primaryEmail'> {
  confirmPassword: string;
}

@UntilDestroy()
@Component({
  selector: 'app-edit-profile-page',
  templateUrl: './edit-profile-page.component.html',
  styleUrls: ['./edit-profile-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    EditProfilePageService,
    {
      provide: FORM_ERROR_TRANSLOCO_READ,
      useValue: 'user.edit_profile_page.form',
    },
  ],
})
export class EditProfilePageComponent implements OnInit {
  @HostBinding('class.container') public readonly useContainerClass: boolean = true;

  public gender: typeof Gender = Gender;
  public form: FormGroup<EditProfileForm>;

  public readonly maxAdditionalEmailsCount: number = 9;
  public readonly maxUsernamesCount: number = 10;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    private translocoService: TranslocoService,
    private editProfilePageService: EditProfilePageService,
  ) {
  }

  public ngOnInit(): void {
    this.form = this.createForm();

    const user = this.authService.getActiveUserInstant();

    user.emails.forEach(() => this.addEmail());
    user.usernames.forEach(() => this.addUsername());

    this.form.patchValue(user);
  }

  public onSubmit(): void {
    if (!this.form.valid) {
      return;
    }

    this.spinnerService.showSpinner();

    const formValue = this.form.getRawValue();

    this.editProfilePageService.editProfile(formValue).pipe(
      finalize(() => this.spinnerService.hideSpinner()),
      untilDestroyed(this),
    ).subscribe(() => {
      this.notificationService.success(
        this.translocoService.translate('edit_profile_page.toastr.successful_update', null, 'user'),
      );
    }, (error) => {
      this.notificationService.error(error);
    });
  }

  public get emailFormArray(): FormArray<string> {
    return this.form.controls.emails as FormArray;
  }

  public get usernameFormArray(): FormArray<string> {
    return this.form.controls.usernames as FormArray;
  }

  public addEmail(): void {
    this.emailFormArray.push(this.formBuilder.control('', [
      Validators.required,
      Validators.email,
    ]));
  }

  public addUsername(): void {
    this.usernameFormArray.push(this.formBuilder.control('', [
      Validators.required,
      Validators.minLength(3),
    ]));
  }

  public removeEmail(index: number): void {
    const emailFormArray = this.form.controls.emails as FormArray;
    emailFormArray.removeAt(index);
  }

  public removeUsername(index: number): void {
    const usernameFormArray = this.form.controls.usernames as FormArray;
    usernameFormArray.removeAt(index);
  }

  private createForm(): FormGroup<EditProfileForm> {
    return this.formBuilder.group({
      avatar: [null, [
        Validators.required,
      ]],
      birthday: ['', [
        Validators.required,
        BaseValidationUtil.isFrDateFormatCorrect,
      ]],
      confirmPassword: ['', [
        PasswordValidationUtil.equalsToAdjacentControl('password'),
      ]],
      firstName: ['', [
        Validators.required,
      ]],
      gender: [null, [
        Validators.required,
      ]],
      lastName: ['', [
        Validators.required,
      ]],
      emails: this.formBuilder.array([]),
      primaryEmail: [{ value: '', disabled: true }],
      usernames: this.formBuilder.array([]),
      password: ['', [
        Validators.minLength(8),
        PasswordValidationUtil.validatePasswordStrength,
      ]],
    });
  }
}

import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormArray, FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { from, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { NavigationService } from '@shared/services/navigation/navigation.service';
import { Gender, UserService } from '@shared/services/user';
import { BaseValidationUtil, PasswordValidationUtil } from '@shared/utils/validation';
import { AuthService } from '@auth/services';

interface EditProfileForm {
  birthday: string;
  confirmPassword: string;
  gender: Gender;
  emails: string[];
  usernames: string[];
  password: string;
}

@UntilDestroy()
@Component({
  selector: 'app-edit-profile-page',
  templateUrl: './edit-profile-page.component.html',
  styleUrls: ['./edit-profile-page.component.scss'],
  providers: [
    {
      provide: FORM_ERROR_TRANSLOCO_READ,
      useValue: 'user.edit_profile_page.form',
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProfilePageComponent implements OnInit {
  @HostBinding('class.container') public readonly useContainerClass: boolean = true;

  public gender: typeof Gender = Gender;
  public form: FormGroup<EditProfileForm>;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private navigationService: NavigationService,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.form = this.createForm();
    const user = this.authService.getActiveUserInstant();
    user.emails.forEach(() => this.addEmail());
    user.usernames.forEach(() => this.addUsername());
    this.form.patchValue(user);
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    const formValue = this.form.getRawValue();
    const user = this.authService.getActiveUserInstant();
    from(this.authService.updateUser(user.id, formValue)).pipe(
      mergeMap(() => {
        if (formValue.gender === user.gender && formValue.birthday === user.birthday) {
          return of(void 0);
        }

        return this.userService.setUserPublic(
          {
            gender: formValue.gender,
            birthday: formValue.birthday,
          },
          user.walletAddress,
          user.privateKey,
        );
      }),
      mergeMap(() => {
        if (formValue.emails.join() === user.emails.join()
          && formValue.usernames.join() === user.usernames.join()
        ) {
          return of(void 0);
        }

        return this.userService.setUserPrivate(
          {
            emails: formValue.emails,
            usernames: formValue.usernames,
          },
          user.walletAddress,
          user.privateKey,
        )
      }),
      untilDestroyed(this),
    ).subscribe();
  }

  public navigateBack(): void {
    this.navigationService.getPreviousUrl();
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
      birthday: ['', [
        Validators.required,
        BaseValidationUtil.isFrDateFormatCorrect,
      ]],
      confirmPassword: ['', [
        PasswordValidationUtil.equalsToAdjacentControl('password'),
      ]],
      gender: [null, [
        Validators.required,
      ]],
      emails: this.formBuilder.array([]),
      usernames: this.formBuilder.array([]),
      password: ['', [
        Validators.minLength(8),
        PasswordValidationUtil.validatePasswordStrength,
      ]],
    });
  }
}

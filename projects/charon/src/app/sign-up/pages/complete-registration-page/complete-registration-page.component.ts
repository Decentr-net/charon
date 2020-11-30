import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { FormArray, FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Gender } from 'decentr-js';

import { UserPrivate } from '@root-shared/services/auth';
import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { BaseValidationUtil } from '@shared/utils/validation';
import { AuthService } from '@core/auth';
import { NotificationService, SpinnerService } from '@core/services';
import { AppRoute } from '../../../app-route';
import { SignUpRoute } from '../../sign-up-route';
import { CompleteRegistrationPageService, UserCompleteUpdate } from './complete-registration-page.service';

type CompleteRegistrationForm = UserCompleteUpdate & Pick<UserPrivate, 'primaryEmail'>;

@UntilDestroy()
@Component({
  selector: 'app-complete-registration-page',
  templateUrl: './complete-registration-page.component.html',
  styleUrls: ['./complete-registration-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CompleteRegistrationPageService,
    {
      provide: FORM_ERROR_TRANSLOCO_READ,
      useValue: 'sign_up.complete_registration.form',
    },
  ],
})
export class CompleteRegistrationPageComponent implements OnInit {
  @HostBinding('class.container') public readonly useContainerClass: boolean = true;

  public gender: typeof Gender = Gender;

  public form: FormGroup<CompleteRegistrationForm>;

  public readonly maxAdditionalEmailsCount: number = 9;
  public readonly maxUsernamesCount: number = 10;

  constructor(
    private authService: AuthService,
    private completeRegistrationPageService: CompleteRegistrationPageService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private router: Router,
    private spinnerService: SpinnerService,
  ) {
  }

  public ngOnInit(): void {
    this.form = this.createForm();

    this.addUsername();

    const user = this.authService.getActiveUserInstant();
    this.form.patchValue(user);
  }

  public onSubmit(): void {
    if (!this.form.valid) {
      return;
    }

    const formValue = this.form.getRawValue();

    this.spinnerService.showSpinner();

    this.completeRegistrationPageService.updateUser(formValue)
      .pipe(
        finalize(() => this.spinnerService.hideSpinner()),
        untilDestroyed(this),
      )
      .subscribe(() => {
        this.router.navigate([AppRoute.SignUp, SignUpRoute.Success]);
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

  private createForm(): FormGroup<CompleteRegistrationForm> {
    return this.formBuilder.group({
      avatar: [null, [
        Validators.required,
      ]],
      birthday: ['', [
        Validators.required,
        BaseValidationUtil.isFrDateFormatCorrect,
      ]],
      emails: this.formBuilder.array([]),
      firstName: ['', [
        Validators.required,
      ]],
      gender: [null, [
        Validators.required,
      ]],
      lastName: ['', [
        Validators.required,
      ]],
      primaryEmail: [{ value: '', disabled: true }],
      usernames: this.formBuilder.array([]),
    });
  }
}

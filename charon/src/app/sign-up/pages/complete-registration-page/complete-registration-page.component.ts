import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { finalize, mergeMap } from 'rxjs/operators';
import { FormArray, FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { Gender } from 'decentr-js';

import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { BaseValidationUtil } from '@shared/utils/validation';
import { AuthService, AuthUser } from '@core/auth';
import { SpinnerService } from '@core/spinner';
import { UserService } from '@core/services';
import { AppRoute } from '../../../app-route';
import { SignUpStoreService } from '../../services';
import { SignUpRoute } from '../../sign-up-route';

interface CompleteRegistrationForm {
  birthday: string;
  gender: AuthUser['gender'];
  emails: string[];
  usernames: string[];
}

@UntilDestroy()
@Component({
  selector: 'app-complete-registration-page',
  templateUrl: './complete-registration-page.component.html',
  styleUrls: ['./complete-registration-page.component.scss'],
  providers: [
    {
      provide: FORM_ERROR_TRANSLOCO_READ,
      useValue: 'sign_up.complete_registration.form',
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteRegistrationPageComponent implements OnInit {
  @HostBinding('class.container') public readonly useContainerClass: boolean = true;

  public gender: typeof Gender = Gender;
  public form: FormGroup<CompleteRegistrationForm>;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private signUpStoreService: SignUpStoreService,
    private spinnerService: SpinnerService,
    private toastrService: ToastrService,
    private translocoService: TranslocoService,
    private userService: UserService,
  ) {
  }

  public ngOnInit() {
    this.form = this.createForm();

    const user = this.authService.getActiveUserInstant();
    this.addEmail();
    this.addUsername();
    this.form.controls.emails.patchValue([user.primaryEmail]);
    this.form.get(['emails', 0]).disable();
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    this.spinnerService.showSpinner();

    const formValue = this.form.getRawValue();
    const user = this.authService.getActiveUserInstant();
    from(this.authService.updateUser(user.id, formValue)).pipe(
      mergeMap(() => {
        return this.userService.setUserPublic(
          {
            gender: formValue.gender,
            birthday: formValue.birthday,
          },
          user.wallet.address,
          user.wallet.privateKey,
        );
      }),
      mergeMap(() => {
        return this.userService.setUserPrivate(
          {
            emails: formValue.emails,
            usernames: formValue.usernames,
          },
          user.wallet.address,
          user.wallet.privateKey,
        )
      }),
      mergeMap(() => this.authService.completeRegistration(user.id)),
      finalize(() => this.spinnerService.hideSpinner()),
      untilDestroyed(this),
    ).subscribe(() => {
      this.router.navigate([AppRoute.SignUp, SignUpRoute.Success]);
    }, () => {
      this.toastrService.error(this.translocoService.translate('toastr.errors.unknown_error'));
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
      birthday: ['', [
        Validators.required,
        BaseValidationUtil.isFrDateFormatCorrect,
      ]],
      gender: [null, [
        Validators.required,
      ]],
      emails: this.formBuilder.array([]),
      usernames: this.formBuilder.array([]),
    });
  }
}

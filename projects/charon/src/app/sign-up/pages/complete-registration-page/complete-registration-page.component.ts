import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Gender, ProfileUpdate } from 'decentr-js';

import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { ProfileFormControlValue } from '@shared/components/profile-form';
import { NotificationService } from '@shared/services/notification';
import { AuthService, AuthUser } from '@core/auth';
import { SpinnerService } from '@core/services';
import { AppRoute } from '../../../app-route';
import { SignUpRoute } from '../../sign-up-route';
import { CompleteRegistrationPageService } from './complete-registration-page.service';

interface CompleteRegistrationForm {
  profile: ProfileFormControlValue;
}

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

    const user = this.authService.getActiveUserInstant() as AuthUser;
    this.form.patchValue({ profile: {
      ...user,
      // usernames: [''],
    }});
  }

  public onSubmit(): void {
    if (!this.form.valid) {
      return;
    }

    const formValue = this.form.getRawValue();

    this.spinnerService.showSpinner();

    this.completeRegistrationPageService.updateUser(formValue.profile as Required<ProfileUpdate>)
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

  private createForm(): FormGroup<CompleteRegistrationForm> {
    return this.formBuilder.group({
      profile: undefined,
    });
  }
}

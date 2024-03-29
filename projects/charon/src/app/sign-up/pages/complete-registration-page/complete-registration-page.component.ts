import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, map } from 'rxjs/operators';
import { ControlsOf, FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Profile } from 'decentr-js';

import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { ProfileFormControlValue } from '@shared/components/profile-form';
import { NotificationService } from '@shared/services/notification';
import { AuthService } from '@core/auth';
import { SpinnerService, UserService } from '@core/services';
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
      useValue: 'core.profile_form',
    },
  ],
})
export class CompleteRegistrationPageComponent implements OnInit {
  @HostBinding('class.container') public readonly useContainerClass: boolean = true;

  public form: FormGroup<ControlsOf<CompleteRegistrationForm>>;

  constructor(
    private authService: AuthService,
    private completeRegistrationPageService: CompleteRegistrationPageService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private router: Router,
    private spinnerService: SpinnerService,
    private userService: UserService,
  ) {
  }

  public ngOnInit(): void {
    this.form = this.createForm();

    const user = this.authService.getActiveUserInstant();

    this.userService.getProfile(user.wallet.address, user.wallet.privateKey).pipe(
      map((profile) => profile || {} as Profile),
      untilDestroyed(this),
    ).subscribe((profile) => {
      if (!profile.emails?.length && user.primaryEmail) {
        profile.emails = [user.primaryEmail];
      }

      this.form.get('profile').patchValue(profile);
    });
  }

  public onSubmit(): void {
    if (!this.form.valid) {
      return;
    }

    const formValue = this.form.getRawValue();

    this.spinnerService.showSpinner();

    this.completeRegistrationPageService.updateUser(formValue.profile)
      .pipe(
        finalize(() => this.spinnerService.hideSpinner()),
        untilDestroyed(this),
      )
      .subscribe({
        next: () => this.router.navigate([AppRoute.SignUp, SignUpRoute.PDVConsent]),
        error: (error) => this.notificationService.error(error),
      });
  }

  private createForm(): FormGroup<ControlsOf<CompleteRegistrationForm>> {
    return this.formBuilder.group({
      profile: undefined,
    });
  }
}

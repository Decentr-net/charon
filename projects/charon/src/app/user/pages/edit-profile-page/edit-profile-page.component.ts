import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StatusCodes } from 'http-status-codes';

import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { NotificationService } from '@shared/services/notification';
import { AppRoute } from '../../../app-route';
import { AuthService } from '@core/auth';
import { EditProfilePageService } from './edit-profile-page.service';
import { TranslatedError } from '@core/notifications';
import { SpinnerService, UserService } from '@core/services';
import { ProfileFormControlValue } from '@shared/components/profile-form';

interface EditProfileForm {
  password: string;
  profile: ProfileFormControlValue;
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
      useValue: 'core.profile_form',
    },
  ],
})
export class EditProfilePageComponent implements OnInit {
  @HostBinding('class.container') public readonly useContainerClass: boolean = true;

  public appRoute: typeof AppRoute = AppRoute;
  public form: FormGroup<EditProfileForm>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    private translocoService: TranslocoService,
    private editProfilePageService: EditProfilePageService,
    private userService: UserService,
    private router: Router,
  ) {
  }

  public ngOnInit(): void {
    this.form = this.createForm();

    const wallet = this.authService.getActiveUserInstant().wallet;

    this.userService.getProfile(wallet.address, wallet).pipe(
      untilDestroyed(this),
    ).subscribe((profile) => {
      this.form.get('profile').patchValue(profile);
    });
  }

  public onSubmit(): void {
    if (!this.form.valid) {
      return;
    }

    this.spinnerService.showSpinner();

    const formValue = this.form.getRawValue();

    this.editProfilePageService.editProfile({
      ...formValue.profile,
      password: formValue.password,
    }).pipe(
      catchError((error) => {
        switch (error?.response?.status) {
          case StatusCodes.TOO_MANY_REQUESTS:
            return throwError(new TranslatedError(
              this.translocoService.translate(
                `edit_profile_page.toastr.errors.${StatusCodes.TOO_MANY_REQUESTS}`,
                null,
                'user',
              ),
            ));
          default:
            return throwError(error);
        }
      }),
      finalize(() => this.spinnerService.hideSpinner()),
      untilDestroyed(this),
    ).subscribe(() => {
      this.notificationService.success(
        this.translocoService.translate('edit_profile_page.toastr.successful_update', null, 'user'),
      );

      this.router.navigate(['../'], {
        relativeTo: this.activatedRoute
      });
    }, (error) => {
      this.notificationService.error(error);
    });
  }

  private createForm(): FormGroup<EditProfileForm> {
    return this.formBuilder.group({
      profile: undefined,
      password: '',
    });
  }
}

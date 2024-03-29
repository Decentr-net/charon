import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { HttpStatusCode } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlsOf, FormBuilder, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Profile } from 'decentr-js';

import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { NotificationService } from '@shared/services/notification';
import { AppRoute } from '../../../app-route';
import { AuthService } from '@core/auth';
import { EditProfilePageService } from './edit-profile-page.service';
import { TranslatedError } from '@core/notifications';
import { SpinnerService, UserService } from '@core/services';
import { ProfileFormControlValue } from '@shared/components/profile-form';

interface EditProfileForm {
  oldPassword: string;
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

  public form: FormGroup<ControlsOf<EditProfileForm>>;

  public profile: Profile;

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

  public get passwordControl(): FormControl<string> {
    return this.form?.get('password');
  }

  public get hasChanges(): boolean {
    return this.profile
      && (!this.editProfilePageService.areProfilesIdentical(this.form.getRawValue().profile, this.profile)
        || !!this.form.getRawValue().password);
  }

  public ngOnInit(): void {
    this.form = this.createForm();

    const wallet = this.authService.getActiveUserInstant().wallet;

    this.userService.getProfile(wallet.address, wallet.privateKey).pipe(
      untilDestroyed(this),
    ).subscribe((profile) => {
      this.profile = profile;
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
      oldPassword: formValue.oldPassword,
    }).pipe(
      catchError((error) => {
        switch (error?.response?.status) {
          case HttpStatusCode.TooManyRequests:
            return throwError(() => new TranslatedError(
              this.translocoService.translate(
                `edit_profile_page.toastr.errors.${HttpStatusCode.TooManyRequests}`,
                null,
                'user',
              ),
            ));
          default:
            return throwError(() => error);
        }
      }),
      finalize(() => this.spinnerService.hideSpinner()),
      untilDestroyed(this),
    ).subscribe({
      next: () => {
        this.notificationService.success(
          this.translocoService.translate('edit_profile_page.toastr.successful_update', null, 'user'),
        );

        this.router.navigate(['../'], {
          relativeTo: this.activatedRoute,
        });
      },
      error: (error) => this.notificationService.error(error),
    });
  }

  private createForm(): FormGroup<ControlsOf<EditProfileForm>> {
    return this.formBuilder.group({
      profile: undefined,
      oldPassword: [
        '',
        [],
        [
          this.editProfilePageService.createCurrentPasswordValidAsyncValidator(),
        ],
      ],
      password: '',
    });
  }
}

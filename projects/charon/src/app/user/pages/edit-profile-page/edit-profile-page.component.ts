import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { finalize } from 'rxjs/operators';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { NotificationService } from '@shared/services/notification';
import { AppRoute } from '../../../app-route';
import { AuthService } from '@core/auth';
import { EditProfilePageService } from './edit-profile-page.service';
import { SpinnerService } from '@core/services';
import { PasswordValidationUtil } from '@shared/utils/validation';
import { ProfileFormControlValue } from '@shared/components/profile-form';

interface EditProfileForm {
  confirmPassword: string;
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
      useValue: 'user.edit_profile_page.form',
    },
  ],
})
export class EditProfilePageComponent implements OnInit {
  @HostBinding('class.container') public readonly useContainerClass: boolean = true;

  public appRoute: typeof AppRoute = AppRoute;
  public form: FormGroup<EditProfileForm>;

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

    this.form.get('profile').patchValue(user);
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

  private createForm(): FormGroup<EditProfileForm> {
    return this.formBuilder.group({
      profile: [{}],
      confirmPassword: ['', [
        RxwebValidators.compare({ fieldName: 'password' }),
      ]],
      password: ['', [
        Validators.minLength(8),
        PasswordValidationUtil.validatePasswordStrength,
      ]],
    });
  }
}

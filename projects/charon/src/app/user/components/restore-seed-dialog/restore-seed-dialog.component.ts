import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ControlsOf, FormControl, FormGroup } from '@ngneat/reactive-forms';

import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { AuthService } from '@core/auth';

interface PasswordForm {
  password: string;
}

@Component({
  selector: 'app-restore-seed-dialog',
  templateUrl: './restore-seed-dialog.component.html',
  styleUrls: ['./restore-seed-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: FORM_ERROR_TRANSLOCO_READ,
      useValue: 'user.restore_seed_dialog.form',
    },
  ],
})
export class RestoreSeedDialogComponent implements OnInit {
  public passwordForm: FormGroup<ControlsOf<PasswordForm>>;

  public formId = 'RESTORE_SEED_DIALOG_FORM';

  public seedPhrase: string;

  constructor(
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  public ngOnInit(): void {
    this.passwordForm = RestoreSeedDialogComponent.createForm();
  }

  public async onSubmit(): Promise<void> {
    if (!this.passwordForm.valid) {
      return;
    }

    const password = this.passwordForm.getRawValue().password;

    const isPasswordValid = await this.authService.validateCurrentUserPassword(password);

    if (!isPasswordValid) {
      return this.passwordForm.controls.password.setErrors({ invalid: true });
    }

    this.seedPhrase = this.authService.restoreSeedPhrase(password);

    this.changeDetectorRef.markForCheck();
  }

  private static createForm(): FormGroup<ControlsOf<PasswordForm>> {
    return new FormGroup({
      password: new FormControl(
        '',
        [
          Validators.required,
        ],
      ),
    });
  }
}

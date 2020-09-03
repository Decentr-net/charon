import { Component } from '@angular/core';
import { BaseSingleFormGroupComponent } from '../../../shared/components/base-single-form-group/base-single-form-group.component';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { PasswordValidationUtil } from '../../../shared/utils/validation/password/password-validation.util';
import { BaseValidationUtil } from '../../../shared/utils/validation/base/base-validation.util';
import { NavigationService } from '../../../shared/services/navigation/navigation.service';

@Component({
  selector: 'app-import-account-seed-phrase',
  templateUrl: './import-account-seed-phrase.component.html',
  styleUrls: ['./import-account-seed-phrase.component.scss']
})
export class ImportAccountSeedPhraseComponent extends BaseSingleFormGroupComponent {

  isSeedPhraseVisible = false;

  constructor(formBuilder: FormBuilder,
              private navigationService: NavigationService) {
    super();

    this.form = formBuilder.group({
      seedPhrase: [null, [Validators.required, BaseValidationUtil.isSeedPhraseCorrect]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      confirmPassword: null,
      agreeTerms: [null, [Validators.requiredTrue]]
    }, {
      validators: PasswordValidationUtil.validatePasswordsMatches
    });
  }

  navigateBack() {
    this.navigationService.getPreviousUrl();
  }

  onSubmit() {
    // TODO: add service
  }

  toggleSeedPhraseVisibility() {
    this.isSeedPhraseVisible = !this.isSeedPhraseVisible;
  }

  get seedPhraseControl(): FormControl {
    return this.form.get('seedPhrase') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get confirmPasswordControl(): FormControl {
    return this.form.get('confirmPassword') as FormControl;
  }
}

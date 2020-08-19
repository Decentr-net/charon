import { FormGroup } from '@angular/forms';
import { ValidationResult } from '../../../models/validation/validation-result.model';
import { BaseValidationUtil } from '../base/base-validation.util';

export class PasswordValidationUtil extends BaseValidationUtil {

  static validatePasswordsMatches(formGroup: FormGroup): ValidationResult {

    const passwordControl = formGroup.get('password'),
      confirmPasswordControl = formGroup.get('confirmPassword');

    if (!passwordControl || !confirmPasswordControl || !passwordControl.value) {
      return null;
    }

    const condition = passwordControl.value !== confirmPasswordControl.value;

    if (condition) {
      confirmPasswordControl.setErrors({ passwordsDoNotMatch: true });
    } else {
      confirmPasswordControl.setErrors(null);
    }
  }
}

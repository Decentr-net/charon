import { AbstractControl } from '@angular/forms';
import { ValidationResult } from '../../../models/validation/validation-result.model';

export class BaseValidationUtil {

  static isSeedPhraseCorrect(control: AbstractControl): ValidationResult {
    if (!control || !control.value) {
      return null;
    }

    const controlValueArr = control.value.split(' ');

    const isInvalid = typeof control.value === 'string'
      && (controlValueArr.length !== 12
        || controlValueArr[controlValueArr.length - 1] === ''
        || controlValueArr[0] === ''
        || control.value.indexOf("  ") !== -1
      );

    return isInvalid ? { seedPhraseWrongLength: true } as ValidationResult : null;
  }
}

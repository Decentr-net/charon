import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
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

export function formError(control: AbstractControl) {

  if (!control.invalid) {
    return null;
  }

  if (control instanceof FormControl) {
    return control.errors;
  } else if (control instanceof FormGroup) {
    return Object.entries(control.controls)
      .reduce((prev, [key, value]) => {
        prev[key] = formError(value);
        return prev;
      }, {});
  } else if (control instanceof FormArray) {
    return control.controls.map(formError);
  }
}

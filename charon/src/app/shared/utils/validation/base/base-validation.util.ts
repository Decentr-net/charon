import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
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
        || control.value.indexOf('  ') !== -1
      );

    return isInvalid ? { length: true } as ValidationResult : null;
  }

  static isFrDateFormatCorrect(control: FormControl): { [key: string]: any } {
    if (!control.value) {
      return null;
    }

    // Date format fr-CA (yyyy{-/}mm{-/}dd): \b(\d{4})([\/\-])(0[1-9]|1[012])\2(0[1-9]|[12]\d|3[01])
    const datePattern = new RegExp(`\\b(\\d{4})([\\/\\-])(0[1-9]|1[012])\\2(0[1-9]|[12]\\d|3[01])`);

    return !control.value.match(datePattern) ? { invalidFormat: true } as ValidationResult : null;
  }

  static equalsToAdjacentControl(controlName: string): ValidatorFn {
    return (control: AbstractControl) => {
      const formGroup = control.parent;
      if (!formGroup) {
        return;
      }

      const equalToControl = formGroup.get(controlName);

      return !equalToControl.value || control.value === equalToControl.value
        ? null
        : { valueDoNotMatch: controlName };
    }
  }
}

// TODO: remove?
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

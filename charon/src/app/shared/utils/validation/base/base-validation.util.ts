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

    return isInvalid ? { seedPhraseWrongLength: true } as ValidationResult : null;
  }

  static isUsDateFormatCorrect(control: FormControl): { [key: string]: any } {
    const datePattern = new RegExp(['^02\\/(?:[01]\\d|2\\d)\\/(?:19|20)(?:0[048]|[13579][26]|[2468][048])|',
      '(?:0[13578]|10|12)\\/(?:[0-2]\\d|3[01])\\/(?:19|20)\\d{2}|',
      '(?:0[469]|11)\\/(?:[0-2]\\d|30)\\/(?:19|20)\\d{2}|02\\/(?:[0-1]\\d|2[0-8])\\/(?:19|20)\\d{2}$'].join(''));

    return !control.value.match(datePattern) ? { invalidDate: true } as ValidationResult : null;
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

import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export class BaseValidationUtil {

  static isSeedPhraseCorrect(control: AbstractControl): ValidationErrors | null {
    if (!control || !control.value) {
      return null;
    }

    const controlValueArr = control.value.split(' ');

    const isInvalid = typeof control.value === 'string'
      && (controlValueArr.length !== 24
        || controlValueArr[controlValueArr.length - 1] === ''
        || controlValueArr[0] === ''
        || control.value.indexOf('  ') !== -1
      );

    return isInvalid ? { length: true } : null;
  }

  static isFrDateFormatCorrect(control: FormControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    // Date format fr-CA (yyyy{-/}mm{-/}dd): \b(\d{4})([\/\-])(0[1-9]|1[012])\2(0[1-9]|[12]\d|3[01])
    const datePattern = new RegExp(`\\b(\\d{4})([\\/\\-])(0[1-9]|1[012])\\2(0[1-9]|[12]\\d|3[01])`);

    return !control.value.match(datePattern) ? { invalidFormat: true } : null;
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

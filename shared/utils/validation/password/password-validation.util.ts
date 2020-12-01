import { AbstractControl, ValidationErrors } from '@angular/forms';
import { BaseValidationUtil } from '../base/base-validation.util';

const lowerCharRegExp = /[a-z]/;
const upperCharRegExp = /[A-Z]/;
const specialCharRegExp = /[^A-Za-z0-9]/;
const numbersRegExp = /[0-9]/;

export class PasswordValidationUtil extends BaseValidationUtil {

  static validatePasswordStrength(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    if (control.value.length < 8) {
      return { tooShort: true };
    }

    let matchedGroup = 0;
    let upperCharsUsed = false;
    let lowerCharsUsed = false;
    let numericUsed = false;
    let specialCharsUsed = false;

    if (control.value.match(lowerCharRegExp)) {
      lowerCharsUsed = true;
      matchedGroup++;
    }

    if (control.value.match(upperCharRegExp)) {
      upperCharsUsed = true;
      matchedGroup++;
    }

    if (control.value.match(numbersRegExp)) {
      numericUsed = true;
      matchedGroup++;
    }

    if (control.value.match(specialCharRegExp)) {
      specialCharsUsed = true;
      matchedGroup++;
    }

    if (matchedGroup < 4) {
      if (lowerCharsUsed) {
        return { strength: 'onlyLowerCase' };
      }
      if (upperCharsUsed) {
        return { strength: 'onlyUpperCase' };
      }
      if (numericUsed) {
        return { strength: 'onlyDigits' };
      }
      if (specialCharsUsed) {
        return { strength: 'onlySpecialChars' };
      }
    }

    return null;
  }
}

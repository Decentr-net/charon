import {
  AbstractControl,
  FormControl,
  ValidationErrors,
} from '@angular/forms';
import { ValidatorFn } from '@ngneat/reactive-forms';

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

  static minDate(minDate: string): ValidatorFn<string> {
    return (control) => {
      return new Date(minDate) > new Date(control.value)
        ? {
          minDate: { value: minDate },
        }
        : null
    };
  }

  static maxDate(maxDate: string): ValidatorFn<string> {
    return (control) => {
      return new Date(maxDate) < new Date(control.value)
        ? {
          maxDate: { value: maxDate },
        }
        : null
    };
  }

  static minHtmlTextLength(minLength: number): ValidatorFn<string> {
    return (control) => {
      const html = control.value;
      const textarea = document.createElement('textarea');
      textarea.innerHTML = html;
      const htmlTextLength = textarea.textContent.trim().length;

      console.log(htmlTextLength);

      return htmlTextLength < minLength
        ? {
          minHtmlTextLength: {
            current: htmlTextLength,
            min: minLength,
          },
        }
        : null;
    }
  }

  static maxStringBytes(maxBytes: number): ValidatorFn<string> {
    return (control) => {
      if (!control.value) {
        return null;
      }

      const bytesLength = new TextEncoder().encode(control.value).length;

      return bytesLength > maxBytes
        ? {
          maxBytes: {
            current: bytesLength,
            max: maxBytes,
          },
        }
        : null;
    }
  }
}

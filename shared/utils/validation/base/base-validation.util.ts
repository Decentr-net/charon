import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ValidatorFn } from '@ngneat/reactive-forms';

import { getHTMLImagesCount } from '../../html';

export class BaseValidationUtil {

  static isSeedPhraseCorrect(control: AbstractControl): ValidationErrors | null {
    if (!control || !control.value) {
      return null;
    }

    const controlValueArr = control.value.trim().split(' ');

    const isInvalid = typeof control.value === 'string'
      && (controlValueArr.length !== 24
        || controlValueArr[controlValueArr.length - 1] === ''
        || controlValueArr[0] === ''
      );

    return isInvalid ? { length: true } : null;
  }

  static minDate(minDate: Date, parseFn?: (value) => Date): ValidatorFn<string> {
    return (control) => {
      return new Date(minDate) > (parseFn ? parseFn(control.value) : new Date(control.value))
        ? {
          minDate: { value: BaseValidationUtil.dateToString(minDate) },
        }
        : null;
    };
  }

  static maxDate(maxDate: Date, parseFn?: (value) => Date): ValidatorFn<string> {
    return (control) => {
      return new Date(maxDate) < (parseFn ? parseFn(control.value) : new Date(control.value))
        ? {
          maxDate: { value: BaseValidationUtil.dateToString(maxDate) },
        }
        : null;
    };
  }

  static minHtmlTextLength(minLength: number): ValidatorFn<string> {
    return (control) => {
      const html = control.value;
      const textarea = document.createElement('div');
      textarea.innerHTML = html;
      const htmlTextLength = textarea.textContent.trim().length;

      return htmlTextLength < minLength
        ? {
          minHtmlTextLength: {
            current: htmlTextLength,
            min: minLength,
          },
        }
        : null;
    };
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
    };
  }

  static maxHTMLImages(maxImages: number): ValidatorFn<string> {
    return (control) => {
      if (!control.value) {
        return null;
      }

      const imagesCount = getHTMLImagesCount(control.value);

      return imagesCount > maxImages
        ? {
          maxImages: {
            current: imagesCount,
            max: maxImages,
          },
        }
        : null;
    };
  }

  private static dateToString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return [year, month, day].join('-');
  }
}

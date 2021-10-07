import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

export const CHAR_NO_BREAK_SPACE = '\u00A0';
export const DEFAULT_DECIMAL_SEPARATOR = '.';

@Pipe({
  name: 'numberFormat',
})
export class NumberFormatPipe implements PipeTransform {

  constructor(
    private decimalPipe: DecimalPipe,
  ) {
  }

  transform(
    value: number,
    digitsInfo: string | null = null,
    separateThousands = false,
    decimalSeparator: string = DEFAULT_DECIMAL_SEPARATOR,
    thousandSeparator: string = CHAR_NO_BREAK_SPACE,
  ): string {
    const transformedValue = digitsInfo === null
      ? value
      : this.decimalPipe.transform(value, digitsInfo).replace(/,/g, '');

    const integerPartString = Math.floor(Math.abs(Number(transformedValue))).toString();
    const fractionPartString = transformedValue.toString().split('.')[1] || '';
    const remainder = integerPartString.length % 3;
    const sign = transformedValue < 0 ? '-' : '';
    let result = sign + integerPartString.charAt(0);

    if (!separateThousands) {
      thousandSeparator = '';
    }

    for (let i = 1; i < integerPartString.length; i++) {
      if (i % 3 === remainder && integerPartString.length > 3) {
        result += thousandSeparator;
      }

      result += integerPartString.charAt(i);
    }

    const separator = !!decimalSeparator
      ? decimalSeparator
      : DEFAULT_DECIMAL_SEPARATOR;

    return !!fractionPartString
      ? result + separator + fractionPartString
      : result;
  }
}

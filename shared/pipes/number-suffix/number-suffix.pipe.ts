import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'numberSuffix',
})
export class NumberSuffixPipe implements PipeTransform {

  constructor(
    private decimalPipe: DecimalPipe,
  ) {
  }

  transform(
    input: number,
    digitsInfo: string | null = null,
  ): string {

    const suffixes: string[] = ['k', 'M', 'G', 'T', 'P', 'E'];

    if (Number.isNaN(input)) {
      return '';
    }

    if (input < 1000) {
      return String(input);
    }

    const exp = Math.floor(Math.log(input) / Math.log(1000));

    return this.decimalPipe.transform((input / Math.pow(1000, exp)), digitsInfo).replace(/,/g, '') + suffixes[exp - 1];
  }
}

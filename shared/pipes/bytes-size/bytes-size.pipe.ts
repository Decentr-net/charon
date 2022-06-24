import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'appBytesSize',
})
export class BytesSizePipe implements PipeTransform {

  constructor(
    private decimalPipe: DecimalPipe,
  ) {
  }

  transform(value: number, showSuffix: boolean = true, digitsInfo: string = '1.0-2'): string | null {
    const suffixes: string[] = ['kb', 'MB', 'GB', 'TB', 'PB', 'EB'];

    if (Number.isNaN(value)) {
      return '';
    }

    if (value === null) {
      return '';
    }

    if (Math.abs(value) < 1000) {
      return String(value);
    }

    const exp = Math.floor(Math.log(Math.abs(value)) / Math.log(1000));
    const decimalTransformed = this.decimalPipe.transform((value / Math.pow(1000, exp)), digitsInfo);
    const suffix = showSuffix ? ' ' + suffixes[exp - 1] : '';

    return `${(decimalTransformed || '').replace(/,/g, '')}${suffix}`;
  }
}

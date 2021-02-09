import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'microValue',
})
export class MicroValuePipe implements PipeTransform {

  constructor(
    private decimalPipe: DecimalPipe,
  ) {
  }

  public transform(value: string | number, digitsInfo: string = '1.6'): string {
    return value
      ? this.decimalPipe.transform(Number(value) / 1000000, digitsInfo).replace(',', '')
      : '';
  }
}

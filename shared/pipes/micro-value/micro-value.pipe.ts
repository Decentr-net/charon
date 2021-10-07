import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

export const MICRO_PDV_DIVISOR = 1000000;

@Pipe({
  name: 'microValue',
})
export class MicroValuePipe implements PipeTransform {

  constructor(
    private decimalPipe: DecimalPipe,
  ) {
  }

  public transform(value: string | number, digitsInfo: string = '1.6'): string {
    return typeof value === 'number' || typeof value === 'string'
      ? this.decimalPipe.transform(Number(value) / MICRO_PDV_DIVISOR, digitsInfo).replace(/,/g, '')
      : '';
  }
}

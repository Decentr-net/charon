import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'pdvValue',
})
export class PdvValuePipe implements PipeTransform {

  constructor(
    private decimalPipe: DecimalPipe,
  ) {
  }

  public transform(value: string | number, digitsInfo: string = '1.7', digitsInfoMicro: string = '1.1'): string {
    return value === 0
      ? '0'
      : value < 1
        ? this.decimalPipe.transform(Number(value) * 1000000, digitsInfoMicro) + 'μ'
        : this.decimalPipe.transform(value, digitsInfo);
  }
}

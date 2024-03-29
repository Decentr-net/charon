import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { MICRO_PDV_DIVISOR } from '../micro-value';

@Pipe({
  name: 'pdvValue',
})
export class PdvValuePipe implements PipeTransform {

  constructor(
    private decimalPipe: DecimalPipe,
  ) {
  }

  public transform(
    value: string | number,
    convertToMu = false,
    digitsInfo = '1.6',
    digitsInfoMicro = '1.0-1',
  ): string {
    return Number(value) === 0
      ? '0'
      : convertToMu
        ? this.decimalPipe.transform(Number(value) * MICRO_PDV_DIVISOR, digitsInfoMicro) + 'μ'
        : this.decimalPipe.transform(Number(value), digitsInfo);
  }
}

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

  public transform(value: string | number, digitsInfo?: string, showMu?: boolean): string {
    const micro = this.decimalPipe.transform(Number(value) * 1000000, digitsInfo);

    return showMu ? micro + 'μ' : micro + '';
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Coin } from 'decentr-js';

import { Denom, DENOM_DIVIDER, DENOM_MAP } from './price.definitions';

@Pipe({
  name: 'appPrice',
})
export class PricePipe implements PipeTransform {

  constructor(
    private decimalPipe: DecimalPipe,
  ) {
  }

  public transformAmount(amount: string, digitsInfo: string): string {
    return this.decimalPipe.transform(+amount / DENOM_DIVIDER, digitsInfo) || '';
  }

  public transform(price: Coin, showDenom: boolean = true, digitsInfo: string = '1.0-6'): string {
    const amount = this.transformAmount(price?.amount, digitsInfo);
    const denom = showDenom ? ' ' + this.convertDenom(price?.denom) : '';

    return `${amount}${denom}`;
  }

  public convertDenom(denom: string): string {
    return DENOM_MAP[denom as Denom] || denom || '';
  }
}

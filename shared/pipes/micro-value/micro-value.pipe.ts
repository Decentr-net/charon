import { Pipe, PipeTransform } from '@angular/core';

export const MICRO_PDV_DIVISOR = 1000000;

@Pipe({
  name: 'microValue',
})
export class MicroValuePipe implements PipeTransform {

  public transform(value: string | number): number {
    return +value / MICRO_PDV_DIVISOR;
  }
}

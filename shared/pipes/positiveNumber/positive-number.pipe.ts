import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'positiveNumber',
})
export class PositiveNumberPipe implements PipeTransform {
  public transform(num: number): number {
    return Math.abs(num);
  }
}

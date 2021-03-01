import { Pipe, PipeTransform } from '@angular/core';
import { coerceTimestamp } from '../../utils/date';

@Pipe({
  name: 'appCoerceTimestamp',
})
export class CoerceTimestampPipe implements PipeTransform {
  public transform(value: string | number): number {
    return coerceTimestamp(value);
  }
}

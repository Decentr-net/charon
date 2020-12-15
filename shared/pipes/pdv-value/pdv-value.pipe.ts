import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pdvValue',
})
export class PdvValuePipe implements PipeTransform {
  public transform(value: string | number, showMu?: boolean): string {
    const micro = Number(value) * 1000000;

    return showMu ? micro + 'μ' : micro + '';
  }
}

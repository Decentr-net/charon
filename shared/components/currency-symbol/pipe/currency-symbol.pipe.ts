import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CurrencySymbolService } from '../currency-symbol.service';

@Pipe({
  name: 'appCurrencySymbol',
})
export class CurrencySymbolPipe implements PipeTransform {
  constructor(
    private currencySymbolService: CurrencySymbolService,
  ) {
  }

  public transform(target: string, comma: boolean = false): Observable<string> {
    return this.currencySymbolService.getSymbol().pipe(
      map((symbol) => [target, symbol].join(comma ? ', ' : ' ')),
    );
  }
}

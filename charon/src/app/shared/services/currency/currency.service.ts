import { Injectable } from '@angular/core';
import { CurrencyApiService } from '@shared/services/currency/currency-api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  constructor(
    private currencyApiService: CurrencyApiService,
  ) {
  }

  public getCoinRate(ids: string, vs_currencies: string): Observable<number> {
    return this.currencyApiService.getCoinRate(ids, vs_currencies).pipe(
      map(rate => {
        return rate[ids][vs_currencies];
      })
    );
  }
}

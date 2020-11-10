import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CurrencyApiService } from '../api';

@Injectable()
export class CurrencyService {
  constructor(
    private currencyApiService: CurrencyApiService,
  ) {
  }

  public getDecentrCoinRateForUsd(): Observable<number> {
    const blockchainId = 'decentr';
    const currencyId = 'usd';

    return this.currencyApiService.getCoinRate([blockchainId], [currencyId])
      .pipe(
        map((rates) => rates[blockchainId][currencyId])
      )
  }
}

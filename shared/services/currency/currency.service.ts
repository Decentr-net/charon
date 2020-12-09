import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ColorValueDynamic } from '../../components/color-value-dynamic';
import { CurrencyApiService } from './api';

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
      );
  }

  public getDecentrCoinRateForUsd24hours(): Observable<ColorValueDynamic> {
    const blockchainId = 'decentr';
    const currencyId = 'usd';
    const lastDayChange = `${currencyId}_24h_change`;

    return this.currencyApiService.getCoinRate([blockchainId], [currencyId], true)
      .pipe(
        map((rates) => ({
          dayMargin: rates[blockchainId][lastDayChange],
          value: rates[blockchainId][currencyId]
        }))
      );
  }
}

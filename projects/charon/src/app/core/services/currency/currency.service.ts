import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CoinRateHistoryResponse, CurrencyApiService } from '../api';

export interface CoinRateFor24Hours {
  dayMargin: number;
  value: number;
}

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

  public getDecentrCoinRateForUsd24hours(): Observable<CoinRateFor24Hours> {
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

  public getDecentrCoinRateHistory(days: number): Observable<CoinRateHistoryResponse['prices']> {
    const blockchainId = 'decentr';
    const currencyId = 'usd';

    return this.currencyApiService.getCoinRateHistory(blockchainId, currencyId, days)
      .pipe(
        map((rateHistory) => rateHistory.prices)
      );
  }
}

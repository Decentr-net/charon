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
  private readonly blockchainId = 'decentr';

  private readonly currencyId = 'usd';

  constructor(
    private currencyApiService: CurrencyApiService,
  ) {
  }

  public getDecentrCoinRateForUsd(): Observable<number> {
    return this.currencyApiService.getCoinRate([this.blockchainId], [this.currencyId])
      .pipe(
        map((rates) => rates[this.blockchainId][this.currencyId]),
      );
  }

  public getDecentrCoinRateForUsd24hours(): Observable<CoinRateFor24Hours> {
    const lastDayChange = `${this.currencyId}_24h_change`;

    return this.currencyApiService.getCoinRate([this.blockchainId], [this.currencyId], true)
      .pipe(
        map((rates) => ({
          dayMargin: rates[this.blockchainId][lastDayChange],
          value: rates[this.blockchainId][this.currencyId],
        })),
      );
  }

  public getDecentrCoinRateHistory(days: number): Observable<CoinRateHistoryResponse['prices']> {
    return this.currencyApiService.getCoinRateHistory(this.blockchainId, this.currencyId, days)
      .pipe(
        map((rateHistory) => rateHistory.prices),
      );
  }
}

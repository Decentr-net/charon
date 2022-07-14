import { defer, mergeMap, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CoinRateHistoryResponse, CoinRateResponse } from './currency-api.definitions';
import { Environment } from '../../../environments/environment.definitions';

export interface CoinRateFor24Hours {
  dayMargin: number;
  value: number;
}

export class CurrencyService {
  private readonly blockchainId = 'decentr';

  private readonly currencyId = 'usd';

  constructor(
    private environment: Environment,
  ) {
  }

  private fetch<T>(url: string): Observable<T> {
    return defer(() => fetch(url)).pipe(
      mergeMap((response) => response.json()),
    );
  }

  private buildQueryParams<T>(params: T): string {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value instanceof Array) {
        queryParams.append(key, value.join());
      } else {
        queryParams.append(key, value.toString());
      }
    });

    return queryParams.toString();
  }

  public getCoinRate(
    blockchainIds: string[],
    currencies: string[],
    include24hChange: boolean = false,
  ): Observable<CoinRateResponse> {
    const queryParams = {
      ids: blockchainIds,
      vs_currencies: currencies,
      include_24hr_change: include24hChange,
    };

    return this.fetch(`${this.environment.currencyApi}/simple/price?${this.buildQueryParams(queryParams)}`);
  }

  public getCoinRateHistory(
    blockchainId: string,
    currency: string,
    days: number,
    interval: 'daily' | null = 'daily',
  ): Observable<CoinRateHistoryResponse> {
    const queryParams = {
      vs_currency: currency,
      days,
      interval,
    };

    return this.fetch(`${this.environment.currencyApi}/coins/${blockchainId}/market_chart?${this.buildQueryParams(queryParams)}`);
  }

  public getDecentrCoinRateForUsd(): Observable<number> {
    return this.getCoinRate([this.blockchainId], [this.currencyId]).pipe(
      map((rates) => rates[this.blockchainId][this.currencyId]),
    );
  }

  public getDecentrCoinRateForUsd24hours(): Observable<CoinRateFor24Hours> {
    const lastDayChange = `${this.currencyId}_24h_change`;

    return this.getCoinRate([this.blockchainId], [this.currencyId], true).pipe(
      map((rates) => ({
        dayMargin: rates[this.blockchainId][lastDayChange],
        value: rates[this.blockchainId][this.currencyId],
      })),
    );
  }

  public getDecentrCoinRateHistory(days: number): Observable<CoinRateHistoryResponse['prices']> {
    return this.getCoinRateHistory(this.blockchainId, this.currencyId, days).pipe(
      map((rateHistory) => rateHistory.prices),
    );
  }
}

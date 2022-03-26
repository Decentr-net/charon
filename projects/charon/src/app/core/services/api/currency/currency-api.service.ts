import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Environment } from '@environments/environment.definitions';
import { CoinRateHistoryResponse, CoinRateResponse } from './currency-api.definitions';

@Injectable()
export class CurrencyApiService {
  constructor(
    private http: HttpClient,
    private environment: Environment,
  ) {
  }

  public getCoinRate(blockchainIds: string[], currencies: string[], include24hChange?: boolean): Observable<CoinRateResponse> {
    let params = new HttpParams()
      .append('ids', blockchainIds.join())
      .append('vs_currencies', currencies.join());

    if (include24hChange) {
      params = params.append('include_24hr_change', include24hChange.toString());
    }

    return this.http.get<CoinRateResponse>(
      `${this.environment.currencyApi}/simple/price`,
      {
        params,
      },
    );
  }

  public getCoinRateHistory(
    blockchainId: string,
    currency: string,
    days: number,
    interval: 'daily' | null = 'daily',
  ): Observable<CoinRateHistoryResponse> {
    const params = new HttpParams()
      .append('days', days.toString())
      .append('interval', interval)
      .append('vs_currency', currency);

    return this.http.get<CoinRateHistoryResponse>(
      `${this.environment.currencyApi}/coins/${blockchainId}/market_chart`,
      {
        params,
      },
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CoinRateResponse } from './currency-api.definitions';

@Injectable()
export class CurrencyApiService {
  constructor(
    private http: HttpClient,
    private api: string,
  ) {
  }

  public getCoinRate(blockchainIds: string[], currencies: string[], include24hChange?: boolean): Observable<CoinRateResponse> {
    let params = new HttpParams()
      .append(`ids`, blockchainIds.join())
      .append(`vs_currencies`, currencies.join());

    if (include24hChange) {
      params = params.append(`include_24hr_change`, include24hChange.toString());
    }

    return this.http.get<CoinRateResponse>(
      `${this.api}/simple/price`,
      {
        params,
      }
    );
  }

  public getCoinRateHistory(blockchainId: string, currency: string, days: number, interval?: 'daily' | null): Observable<any> {
    const params = new HttpParams()
      .append(`days`, days.toString())
      .append(`interval`, interval)
      .append(`vs_currency`, currency);

    return this.http.get<any>(
      `${this.api}/coins/${blockchainId}/market_chart`,
      {
        params,
      }
    )
  }
}

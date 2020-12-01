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

  public getCoinRate(blockchainIds: string[], currencies: string[]): Observable<CoinRateResponse> {
    const params = new HttpParams()
      .append(`ids`, blockchainIds.join())
      .append(`vs_currencies`, currencies.join());

    return this.http.get<CoinRateResponse>(
      `${this.api}/simple/price`,
      {
        params,
      }
    );
  }
}

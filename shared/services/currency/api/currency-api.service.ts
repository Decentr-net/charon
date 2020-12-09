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
}

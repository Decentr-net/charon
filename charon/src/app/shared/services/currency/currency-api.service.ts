import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Environment } from '@environments/environment.definitions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrencyApiService {
  constructor(
    private http: HttpClient,
    private environment: Environment,
  ) {
  }

  public getCoinRate(ids: string, vs_currencies: string): Observable<object> {
    let params = new HttpParams();

    params = params.append('ids', ids);
    params = params.append('vs_currencies', vs_currencies);

    return this.http.get(`${this.environment.currencyApi}/simple/price`, { params })
  }
}

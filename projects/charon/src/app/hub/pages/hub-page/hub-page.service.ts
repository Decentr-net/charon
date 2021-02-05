import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

import { ChartPoint } from '@shared/components/line-chart';
import { CoinRateFor24Hours, CurrencyService } from '@shared/services/currency';
import { BalanceValueDynamic } from '@shared/services/pdv';
import { AuthService, AuthUser } from '@core/auth';
import { PDVService } from '@core/services';

interface CoinRateHistory {
  date: number,
  value: number,
}

@Injectable()
export class HubPageService {
  constructor(
    private authService: AuthService,
    private currencyService: CurrencyService,
    private pdvService: PDVService,
  ) {
  }

  public getAvatar(): Observable<AuthUser['avatar']> {
    return this.authService.getActiveUser().pipe(
      pluck('avatar'),
    );
  }

  public getBalanceWithMargin(): Observable<BalanceValueDynamic> {
    return this.pdvService.getBalanceWithMargin();
  }

  public getCoinRateWithMargin(): Observable<CoinRateFor24Hours> {
    return this.currencyService.getDecentrCoinRateForUsd24hours();
  }

  public getEstimatedBalance(): Observable<string> {
    return this.pdvService.getEstimatedBalance();
  }

  public getPDVChartPoints(): Observable<ChartPoint[]> {
    return this.pdvService.getPDVStatChartPoints();
  }

  public getDecentCoinRateHistory(days: number): Observable<CoinRateHistory[]> {
    return this.currencyService.getDecentCoinRateHistory(days).pipe(
      map((historyElements) => historyElements.map((historyElement) => ({
        date: historyElement[0],
        value: historyElement[1],
      })))
    );
  }
}

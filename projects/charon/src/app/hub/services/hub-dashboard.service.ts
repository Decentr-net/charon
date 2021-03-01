import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';

import { AuthService } from '@core/auth/services';
import { coerceTimestamp } from '@shared/utils/date';
import { CurrencyService } from '@shared/services/currency';
import { HubCurrencyStatistics } from '../components/hub-currency-statistics';
import { HubPDVStatistics } from '../components/hub-pdv-statistics';
import { map, pluck } from 'rxjs/operators';
import { PDVService, UserService } from '@core/services';

interface CoinRateHistory {
  date: number,
  value: number,
}

@Injectable()
export class HubDashboardService {

  constructor(
    private authService: AuthService,
    private currencyService: CurrencyService,
    private pdvService: PDVService,
    private userService: UserService,
  ) {
  }

  public getEstimatedBalance(): Observable<string> {
    return this.pdvService.getEstimatedBalance();
  }

  private getUserRegisteredAt(): Observable<string> {
    const user = this.authService.getActiveUserInstant();

    return this.userService.getPublicProfile(user.wallet.address).pipe(
      pluck('registeredAt'),
    );
  }

  public getPdvStatistics(): Observable<HubPDVStatistics> {
    return combineLatest([
      this.pdvService.getBalanceWithMargin(),
      this.pdvService.getPDVStatChartPoints(),
      this.getUserRegisteredAt(),
    ]).pipe(
      map(([pdvWithMargin, pdvStatistic, userRegisteredAt]) => ({
        fromDate: coerceTimestamp(userRegisteredAt),
        pdv: pdvWithMargin.value,
        pdvChangedIn24HoursPercent: pdvWithMargin.dayMargin,
        points: pdvStatistic,
      })),
    );
  }

  private getDecentCoinRateHistory(days: number): Observable<CoinRateHistory[]> {
    return this.currencyService.getDecentCoinRateHistory(days).pipe(
      map((historyElements) => historyElements.map((historyElement) => ({
        date: historyElement[0],
        value: historyElement[1],
      }))),
    );
  }

  public getCoinRateStatistics(): Observable<HubCurrencyStatistics> {
    return combineLatest([
      this.currencyService.getDecentrCoinRateForUsd24hours(),
      this.getDecentCoinRateHistory(365),
    ]).pipe(
      map(([rateWithMargin, rateStatistic]) => ({
        points: rateStatistic,
        rate: rateWithMargin.value,
        rateChangedIn24HoursPercent: rateWithMargin.dayMargin,
      })),
    )
  }
}

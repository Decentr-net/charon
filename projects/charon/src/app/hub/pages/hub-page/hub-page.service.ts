import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';

import { AuthService, AuthUser } from '@core/auth';
import { calculateDifferencePercentage, exponentialToFixed } from '@shared/utils/number';
import { ChartPoint } from '@shared/components/line-chart';
import { ColorValueDynamic } from '@shared/components/color-value-dynamic';
import { CurrencyService } from '@shared/services/currency';
import { Environment } from '@environments/environment.definitions';
import { Network, NetworkService } from '@core/services';
import { PDVService } from '@shared/services/pdv';
import { User } from '@shared/services/auth';

interface CoinRateHistory {
  date: number,
  value: number,
}

@Injectable()
export class HubPageService {
  private readonly pdvService: PDVService;

  constructor(
    private authService: AuthService,
    private currencyService: CurrencyService,
    private networkService: NetworkService,
    environment: Environment,
  ) {
    this.pdvService = new PDVService(environment.chainId);
  }

  public getAvatar(): Observable<User['avatar']> {
    return this.authService.getActiveUser().pipe(
      pluck('avatar'),
    );
  }

  public getBalance(): Observable<string> {
    return this.getWalletAddressAndNetworkApiStream().pipe(
      switchMap(({ walletAddress, networkApi }) => {
        return this.pdvService.getBalance(networkApi, walletAddress);
      }),
      map(exponentialToFixed),
    );
  }

  public getBalanceWithMargin(): Observable<ColorValueDynamic> {
    return combineLatest([
      this.getBalance(),
      this.getPDVChartPoints(),
    ])
      .pipe(
        map(([pdvRate, pdvRateHistory]) => {
          const now = new Date;
          const historyDate = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - 1);
          const historyPdvRate = pdvRateHistory.find(el => el.date === historyDate)?.value;

          return {
            dayMargin: calculateDifferencePercentage(Number(pdvRate), historyPdvRate),
            value: pdvRate,
          }
        })
      )
  }

  public getCoinRateWithMargin(): Observable<ColorValueDynamic> {
    return this.currencyService.getDecentrCoinRateForUsd24hours();
  }

  public getPDVChartPoints(): Observable<ChartPoint[]> {
    return this.getWalletAddressAndNetworkApiStream().pipe(
      switchMap(({ walletAddress, networkApi }) => {
        return this.pdvService.getPDVStats(networkApi, walletAddress);
      }),
      map((stats) => stats
        .map(({ date, value }) => ({
          date: new Date(date).valueOf(),
          value,
        }))
        .sort((a, b) => a.date - b.date)
      ),
    );
  }

  public getDecentCoinRateHistory(days: number): Observable<CoinRateHistory[]> {
    return this.currencyService.getDecentCoinRateHistory(days).pipe(
      map((historyElements) => historyElements.map((historyElement) => ({
        date: historyElement[0],
        value: historyElement[1],
      })))
    );
  }

  private getWalletAddressAndNetworkApiStream(): Observable<{
    walletAddress: AuthUser['wallet']['address'];
    networkApi: Network['api'];
  }> {
    return combineLatest([
      this.authService.getActiveUser().pipe(
        pluck('wallet', 'address'),
      ),
      this.networkService.getActiveNetwork().pipe(
        pluck('api')
      ),
    ]).pipe(
      map(([walletAddress, networkApi]) => ({ walletAddress, networkApi })),
    );
  }
}

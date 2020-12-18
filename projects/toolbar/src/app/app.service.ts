import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, pluck, startWith, switchMap } from 'rxjs/operators';

import { AppRoute as CharonAppRoute } from '@charon/app-route';
import { AuthBrowserStorageService, User } from '@shared/services/auth';
import { calculateDifferencePercentage, exponentialToFixed } from '@shared/utils/number';
import { ColorValueDynamic } from '@shared/components/color-value-dynamic';
import { CurrencyService } from '@shared/services/currency';
import { HubFeedRoute as CharonHubFeedRoute, HubRoute as CharonHubRoute } from '@charon/hub';
import { MessageBus } from '@shared/message-bus';
import { Network, NetworkBrowserStorageService } from '@shared/services/network-storage';
import { PDVService, PDVUpdateNotifier } from '@shared/services/pdv';
import { UserRoute as CharonUserRoute } from '@charon/user';
import { MessageCode } from '@scripts/messages';

export interface ChartPoint {
  date: number;
  value: number;
}

@Injectable()
export class AppService {
  private readonly messageBus = new MessageBus();

  constructor(
    private authStorageService: AuthBrowserStorageService,
    private currencyService: CurrencyService,
    private networkStorageService: NetworkBrowserStorageService,
    private pdvService: PDVService,
  ) {
  }

  public closeApp(): void {
    this.messageBus.sendMessage(MessageCode.ToolbarClose);
  }

  public getAvatar(): Observable<User['avatar']> {
    return this.authStorageService.getActiveUser().pipe(
      pluck('avatar'),
    );
  }

  public getBalance(): Observable<string> {
    return combineLatest([
      this.getWalletAddressAndNetworkApiStream(),
      PDVUpdateNotifier.listen().pipe(
        startWith(void 0),
      ),
    ]).pipe(
      switchMap(([{ walletAddress, networkApi }]) => {
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

  private getPDVChartPoints(): Observable<ChartPoint[]> {
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

  public openCharonHubMyWall(): void {
    this.messageBus.sendMessage(MessageCode.Navigate, [
      CharonAppRoute.Hub,
      CharonHubRoute.Feed,
      CharonHubFeedRoute.MyWall,
    ]);
  }

  public openCharonHubOverview(): void {
    this.messageBus.sendMessage(MessageCode.Navigate, [
      CharonAppRoute.Hub,
    ]);
  }

  public openCharonHubRecentNews(): void {
    this.messageBus.sendMessage(MessageCode.Navigate, [
      CharonAppRoute.Hub,
      CharonHubRoute.Feed,
      CharonHubFeedRoute.Recent,
    ]);
  }

  public openCharonUserSettings(): void {
    this.messageBus.sendMessage(MessageCode.Navigate, [
      CharonAppRoute.User,
      CharonUserRoute.Edit,
    ]);
  }

  private getWalletAddressAndNetworkApiStream(): Observable<{
    walletAddress: User['wallet']['address'];
    networkApi: Network['api'];
  }> {
    return combineLatest([
      this.authStorageService.getActiveUser().pipe(
        pluck('wallet', 'address'),
      ),
      this.networkStorageService.getActiveNetwork().pipe(
        pluck('api')
      ),
    ]).pipe(
      map(([walletAddress, networkApi]) => ({ walletAddress, networkApi })),
    );
  }
}

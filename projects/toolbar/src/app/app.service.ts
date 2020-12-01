import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';

import { AuthBrowserStorageService, User } from '@shared/services/auth';
import { CurrencyService } from '@shared/services/currency';
import { Network, NetworkBrowserStorageService } from '@shared/services/network-storage';
import { PDVService } from '@shared/services/pdv';
import { MessageBus } from '@shared/message-bus';
import { exponentialToFixed } from '@shared/utils/number';
import { AppRoute as CharonAppRoute } from '@charon/app-route';
import { HubRoute as CharonHubRoute, HubFeedRoute as CharonHubFeedRoute } from '@charon/hub';
import { UserRoute as CharonUserRoute } from '@charon/user';
import { openCharonPage } from './utils/extension';
import { TOOLBAR_CLOSE } from './messages';

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
    this.messageBus.sendMessageToCurrentTab(TOOLBAR_CLOSE);
  }

  public getAvatar(): Observable<User['avatar']> {
    return this.authStorageService.getActiveUser().pipe(
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

  public getCoinRate(): Observable<number> {
    return this.currencyService.getDecentrCoinRateForUsd();
  }

  public openCharonHubMyWall(): void {
    openCharonPage([
      CharonAppRoute.Hub,
      CharonHubRoute.Feed,
      CharonHubFeedRoute.MyWall,
    ]);
  }

  public openCharonHubOverview(): void {
    openCharonPage([
      CharonAppRoute.Hub,
    ])
  }

  public openCharonHubRecentNews(): void {
    openCharonPage([
      CharonAppRoute.Hub,
      CharonHubRoute.Feed,
      CharonHubFeedRoute.Recent,
    ]);
  }

  public openCharonUserSettings(): void {
    openCharonPage([
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

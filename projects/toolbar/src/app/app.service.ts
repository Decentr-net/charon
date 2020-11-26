import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';

import { AuthBrowserStorageService, User } from '@shared/services/auth';
import { CurrencyService } from '@shared/services/currency';
import { Network, NetworkBrowserStorageService } from '@shared/services/network-storage';
import { MessageBus } from '@shared/message-bus';
import { exponentialToFixed } from '@shared/utils/number';
import { AppRoute as CharonAppRoute } from '@charon/app-route';
import { CircleRoute as CharonCircleRoute, CircleWallRoute as CharonCircleWallRoute } from '@charon/circle';
import { UserRoute as CharonUserRoute } from '@charon/user';
import { openCharonPage } from './utils/extension';
import { TOOLBAR_CLOSE } from './messages';
import { PDVService } from '@shared/services/pdv';

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

  public openCharonNews(): void {
    openCharonPage([
      CharonAppRoute.User,
      CharonCircleRoute.News,
      CharonCircleRoute.World,
      CharonCircleWallRoute.Recent,
    ]);
  }

  public openCharonSettings(): void {
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

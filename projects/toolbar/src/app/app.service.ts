import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, pluck, startWith, switchMap } from 'rxjs/operators';

import { AuthBrowserStorageService, User } from '@shared/services/auth';
import { CoinRateFor24Hours, CurrencyService } from '@shared/services/currency';
import { LockBrowserStorageService } from '@shared/services/lock';
import { Network, NetworkBrowserStorageService } from '@shared/services/network-storage';
import { BalanceValueDynamic, PDVService, PDVUpdateNotifier } from '@shared/services/pdv';

@Injectable()
export class AppService {
  constructor(
    private authStorageService: AuthBrowserStorageService,
    private currencyService: CurrencyService,
    private lockBrowserStorageService: LockBrowserStorageService,
    private networkStorageService: NetworkBrowserStorageService,
    private pdvService: PDVService,
  ) {
  }

  public getAvatar(): Observable<User['avatar']> {
    return this.authStorageService.getActiveUser().pipe(
      pluck('avatar'),
    );
  }

  public getBalanceWithMargin(): Observable<BalanceValueDynamic> {
    return combineLatest([
      this.getWalletAddressAndNetworkApiChanges(),
      PDVUpdateNotifier.listen().pipe(
        startWith(void 0),
      ),
    ]).pipe(
      switchMap(([{ walletAddress, networkApi }]) => {
        return this.pdvService.getBalanceWithMargin(networkApi, walletAddress);
      }),
    )
  }

  public getCoinRateWithMargin(): Observable<CoinRateFor24Hours> {
    return this.currencyService.getDecentrCoinRateForUsd24hours();
  }

  public getLockedState(): Observable<boolean> {
    return this.lockBrowserStorageService.getLockedChanges();
  }

  private getWalletAddressAndNetworkApiChanges(): Observable<{
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

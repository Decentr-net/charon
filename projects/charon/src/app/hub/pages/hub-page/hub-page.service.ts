import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';

import { AuthService, AuthUser } from '@core/auth';
import { ColorValueDynamic } from '@shared/components/color-value-dynamic';
import { CurrencyService } from '@shared/services/currency';
import { Environment } from '@environments/environment.definitions';
import { exponentialToFixed } from '@shared/utils/number';
import { Network, NetworkService } from '@core/services';
import { PDVService } from '@shared/services/pdv';
import { User } from '@shared/services/auth';

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

  public getCoinRateWithMargin(): Observable<ColorValueDynamic> {
    return this.currencyService.getDecentrCoinRateForUsd24hours();
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

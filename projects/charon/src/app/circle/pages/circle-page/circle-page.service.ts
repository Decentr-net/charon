import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';

import { CurrencyService } from '@root-shared/services/currency';
import { PDVService } from '@root-shared/services/pdv';
import { exponentialToFixed } from '@root-shared/utils/number';
import { Environment } from '@environments/environment.definitions';
import { AuthService, AuthUser } from '@core/auth';
import { Network, NetworkSelectorService } from '@core/network-selector';

@Injectable()
export class CirclePageService {
  private readonly pdvService: PDVService;

  constructor(
    private authService: AuthService,
    private currencyService: CurrencyService,
    private networkService: NetworkSelectorService,
    environment: Environment,
  ) {
    this.pdvService = new PDVService(environment.chainId);
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

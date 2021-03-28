import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { pluck} from 'rxjs/operators';

import { AuthBrowserStorageService, User } from '@shared/services/auth';
import { CoinRateFor24Hours, CurrencyService } from '@shared/services/currency';
import { LockBrowserStorageService } from '@shared/services/lock';
import { BalanceValueDynamic, PDVService } from '@shared/services/pdv';

@Injectable()
export class AppService {
  constructor(
    private authStorageService: AuthBrowserStorageService,
    private currencyService: CurrencyService,
    private lockBrowserStorageService: LockBrowserStorageService,
    private pdvService: PDVService,
  ) {
  }

  public getAvatar(): Observable<User['avatar']> {
    return this.authStorageService.getActiveUser().pipe(
      pluck('avatar'),
    );
  }

  public getBalanceWithMargin(): Observable<BalanceValueDynamic> {
    return this.pdvService.getBalanceWithMarginLive();
  }

  public getCoinRateWithMargin(): Observable<CoinRateFor24Hours> {
    return this.currencyService.getDecentrCoinRateForUsd24hours();
  }

  public getLockedState(): Observable<boolean> {
    return this.lockBrowserStorageService.getLockedChanges();
  }
}

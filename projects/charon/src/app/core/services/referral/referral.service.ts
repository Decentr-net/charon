import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';
import { Wallet } from 'decentr-js';

import { AuthService } from '@core/auth';
import { ReferralApiService, ReferralConfig, ReferralTimeStats } from '@core/services/api';

@Injectable()
export class ReferralService {
  constructor(
    private referralApiService: ReferralApiService,
    private authService: AuthService,
  ) {
  }

  public getCode(): Observable<string> {
    return this.authService.getActiveUserAddress().pipe(
      filter((address) => !!address),
      switchMap((address) => this.referralApiService.getCode(address)),
    );
  }

  public getConfig(): Observable<ReferralConfig> {
    return this.referralApiService.getConfig();
  }

  public getStats(): Observable<ReferralTimeStats> {
    return this.authService.getActiveUserAddress().pipe(
      filter((address) => !!address),
      switchMap((address) => this.referralApiService.getStats(address)),
    );
  }

  public trackInstall(walletAddress: Wallet['address']): Observable<void> {
    return this.referralApiService.trackInstall(walletAddress).pipe(
      catchError(() => of(void 0)),
    );
  }
}

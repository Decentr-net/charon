import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';
import { ReferralConfig, ReferralTimeStats, Wallet } from 'decentr-js';

import { AuthService } from '@core/auth';
import { DecentrService } from '@core/services';

@Injectable()
export class ReferralService {
  constructor(
    private decentrService: DecentrService,
    private authService: AuthService,
  ) {
  }

  public getCode(): Observable<string> {
    return combineLatest([
      this.authService.getActiveUserAddress().pipe(
        filter((address) => !!address),
      ),
      this.decentrService.vulcanClient,
    ]).pipe(
      switchMap(([address, vulcanClient]) => vulcanClient.referral.getCode(address)),
    );
  }

  public getConfig(): Observable<ReferralConfig> {
    return this.decentrService.vulcanClient.pipe(
      switchMap((vulcanClient) => vulcanClient.referral.getConfig()),
    );
  }

  public getStats(): Observable<ReferralTimeStats> {
    return combineLatest([
      this.authService.getActiveUserAddress().pipe(
        filter((address) => !!address),
      ),
      this.decentrService.vulcanClient,
    ]).pipe(
      switchMap(([address, vulcanClient]) => vulcanClient.referral.getStats(address)),
    );
  }

  public trackInstall(walletAddress: Wallet['address']): Observable<void> {
    return this.decentrService.vulcanClient.pipe(
      switchMap((vulcanClient) => vulcanClient.referral.trackInstall(walletAddress)),
      catchError(() => of(void 0)),
    );
  }
}

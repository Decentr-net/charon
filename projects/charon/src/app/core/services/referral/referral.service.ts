import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, mapTo, switchMap } from 'rxjs/operators';

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
      mapTo({"total":{"registered":0,"installed":0,"confirmed":0,"reward":0},"last30Days":{"registered":4,"installed":3,"confirmed":600,"reward":20000000}})
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Wallet } from 'decentr-js';

import { ConfigService } from '@shared/services/configuration';
import { ReferralConfig, ReferralTimeStats } from './referral-api.definitions';

@Injectable()
export class ReferralApiService {
  constructor(
    private configService: ConfigService,
    private httpClient: HttpClient,
  ) {
  }

  public getCode(walletAddress: Wallet['address']): Observable<string> {
    return this.configService.getVulcanUrl().pipe(
      switchMap((vulcanUrl) => {
        return this.httpClient.get<{ code: string }>(`${vulcanUrl}/v1/referral/code/${walletAddress}`);
      }),
      map(({ code }) => code),
    );
  }

  public getConfig(): Observable<ReferralConfig> {
    return this.configService.getVulcanUrl().pipe(
      switchMap((vulcanUrl) => {
        return this.httpClient.get<ReferralConfig>(`${vulcanUrl}/v1/referral/config`);
      }),
    );
  }

  public getStats(walletAddress: Wallet['address']): Observable<ReferralTimeStats> {
    return this.configService.getVulcanUrl().pipe(
      switchMap((vulcanUrl) => {
        return this.httpClient.get<ReferralTimeStats>(`${vulcanUrl}/v1/referral/track/stats/${walletAddress}`);
      }),
    );
  }
}

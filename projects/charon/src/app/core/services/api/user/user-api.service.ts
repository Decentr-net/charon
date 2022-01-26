import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Wallet } from 'decentr-js';

import { ConfigService, NetworkId } from '@shared/services/configuration';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  constructor(
    private configService: ConfigService,
    private http: HttpClient,
  ) {
  }

  public createUser(email: string, walletAddress: Wallet['address']): Observable<void> {
    return this.configService.getVulcanUrl().pipe(
      mergeMap((vulcanUrl) => this.http.post<void>(`${vulcanUrl}/v1/register`, {
        address: walletAddress,
        email,
      })),
    );
  }

  public confirmUser(code: string, email: string): Observable<void> {
    return this.configService.getVulcanUrl().pipe(
      mergeMap((vulcanUrl) => this.http.post<void>(`${vulcanUrl}/v1/confirm`, {
        code,
        email,
      })),
    );
  }

  public hesoyam(walletAddress: Wallet['address']): Observable<void> {
    return this.configService.getNetworkConfig(NetworkId.Testnet).pipe(
      map((networkConfig) => networkConfig.vulcan.url),
      mergeMap((vulcanUrl) => this.http.get<void>(`${vulcanUrl}/v1/hesoyam/${walletAddress}`)),
    );
  }
}

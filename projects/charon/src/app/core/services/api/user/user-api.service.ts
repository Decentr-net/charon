import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account, Decentr, PublicProfile, Wallet } from 'decentr-js';

import { Environment } from '@environments/environment.definitions';
import { UserPrivate } from '@shared/services/auth';
import { map, mergeMap } from 'rxjs/operators';
import { ConfigService } from '@shared/services/configuration';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  constructor(
    private configService: ConfigService,
    private environment: Environment,
    private http: HttpClient,
  ) {
  }

  public createUser(email: string, walletAddress: Wallet['address']): Observable<void> {
    return this.configService.getVulcanUrl().pipe(
      mergeMap((vulcanUrl) => this.http.post<void>(`${vulcanUrl}/v1/register`, {
          address: walletAddress,
          email,
        })
      ),
    );
  }

  public confirmUser(code: string, email: string): Observable<void> {
    return this.configService.getVulcanUrl().pipe(
      mergeMap((vulcanUrl) => this.http.post<void>(`${vulcanUrl}/v1/confirm`, {
          code,
          email,
        })
      ),
    );
  }

  public getAccount(api: string, walletAddress: Wallet['address']): Observable<Account> {
    return this.createDecentrConnector(api).pipe(
      mergeMap((decentr) => decentr.profile.getAccount(walletAddress)),
    );
  }

  public getModeratorAddresses(api: string): Observable<string[]> {
    return this.createDecentrConnector(api).pipe(
      mergeMap((decentr) => decentr.community.getModeratorAddresses()),
    );
  }

  public getPrivateProfile(
    api: string,
    walletAddress: Wallet['address'],
    privateKey: Wallet['privateKey'],
  ): Observable<UserPrivate> {
    return this.createDecentrConnector(api).pipe(
      mergeMap((decentr) => decentr.profile.getPrivateProfile<UserPrivate>(walletAddress, privateKey)),
    );
  }

  public getPublicProfile(api: string, walletAddress: Wallet['address']): Observable<PublicProfile> {
    return this.createDecentrConnector(api).pipe(
      mergeMap((decentr) => decentr.profile.getPublicProfile(walletAddress)),
    );
  }

  private createDecentrConnector(api: string): Observable<Decentr> {
    return this.configService.getChainId().pipe(
      map((chainId) => new Decentr(api, chainId)),
    );
  }
}

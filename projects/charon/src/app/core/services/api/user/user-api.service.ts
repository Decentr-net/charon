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
    return this.http.post<void>(`${this.environment.vulcanApi}/register`, {
      address: walletAddress,
      email,
    });
  }

  public confirmUser(code: string, email: string): Observable<void> {
    return this.http.post<void>(`${this.environment.vulcanApi}/confirm`, {
      code,
      email,
    });
  }

  public getAccount(api: string, walletAddress: Wallet['address']): Observable<Account> {
    return this.createDecentrConnector(api).pipe(
      mergeMap((decentr) => decentr.getAccount(walletAddress)),
    );
  }

  public getModeratorAddresses(api: string) {
    return this.createDecentrConnector(api).pipe(
      mergeMap((decentr) => decentr.getModeratorAddresses()),
    );
  }

  public getPrivateProfile(
    api: string,
    walletAddress: Wallet['address'],
    privateKey: Wallet['privateKey'],
  ): Observable<UserPrivate> {
    return this.createDecentrConnector(api).pipe(
      mergeMap((decentr) => decentr.getPrivateProfile<UserPrivate>(walletAddress, privateKey)),
    );
  }

  public getPublicProfile(api: string, walletAddress: Wallet['address']): Observable<PublicProfile> {
    return this.createDecentrConnector(api).pipe(
      mergeMap((decentr) => decentr.getPublicProfile(walletAddress)),
    );
  }

  private createDecentrConnector(api: string): Observable<Decentr> {
    return this.configService.getChainId().pipe(
      map((chainId) => new Decentr(api, chainId)),
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { defer, from, Observable } from 'rxjs';
import { Account, BroadcastResponse, Decentr, PublicProfile, Wallet } from 'decentr-js';

import { Environment } from '@environments/environment.definitions';
import { UserPrivate } from '@shared/services/auth';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  constructor(
    private http: HttpClient,
    private environment: Environment,
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
    const decentr = this.createDecentrConnector(api);
    return defer(() => decentr.getAccount(walletAddress));
  }

  public getModeratorAddress(api: string) {
    const decentr = this.createDecentrConnector(api);

    return defer(() => decentr.getModeratorAddress());
  }

  public getPrivateProfile(
    api: string,
    walletAddress: Wallet['address'],
    privateKey: Wallet['privateKey'],
  ): Observable<UserPrivate> {
    const decentr = this.createDecentrConnector(api);

    return from(decentr.getPrivateProfile<UserPrivate>(walletAddress, privateKey));
  }

  public getPublicProfile(api: string, walletAddress: Wallet['address']): Observable<PublicProfile> {
    const decentr = this.createDecentrConnector(api);

    return from(decentr.getPublicProfile(walletAddress));
  }

  public setPublicProfile(
    publicProfile: PublicProfile,
    api: string,
    walletAddress: Wallet['address'],
    privateKey: Wallet['privateKey'],
  ): Observable<BroadcastResponse> {
    const decentr = this.createDecentrConnector(api);

    return from(decentr.setPublicProfile(walletAddress, publicProfile, {
      broadcast: true,
      privateKey,
    }));
  }

  public setPrivateProfile(
    privateProfile: UserPrivate,
    api: string,
    walletAddress: Wallet['address'],
    privateKey: Wallet['privateKey'],
  ): Observable<BroadcastResponse> {
    const decentr = this.createDecentrConnector(api);

    return from(decentr.setPrivateProfile<UserPrivate>(walletAddress, privateProfile, privateKey, {
      broadcast: true,
    }));
  }

  private createDecentrConnector(api: string): Decentr {
    return new Decentr(api, this.environment.chainId);
  }
}

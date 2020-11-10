import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { Account, BroadcastResponse, Decentr, PrivateProfile, PublicProfile, Wallet } from 'decentr-js';

import { Environment } from '@environments/environment.definitions';
import { UserPrivate } from '@root-shared/services/auth';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  constructor(
    private http: HttpClient,
    private environment: Environment,
  ) {
  }

  public createUser(email: string, walletAddress: string): Observable<void> {
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
    return from(decentr.getAccount(walletAddress));
  }

  public getUserPrivate(
    api: string,
    walletAddress: Wallet['address'],
    privateKey: string,
  ): Observable<Partial<PrivateProfile>> {
    const decentr = this.createDecentrConnector(api);

    return from(decentr.getPrivateProfile(walletAddress, privateKey));
  }

  public getUserPublic(api: string, walletAddress: Wallet['address']): Observable<PublicProfile> {
    const decentr = this.createDecentrConnector(api);

    return from(decentr.getPublicProfile(walletAddress));
  }

  public setUserPublic(
    publicProfile: PublicProfile,
    api: string,
    walletAddress: string,
    privateKey: string,
  ): Observable<BroadcastResponse> {
    const decentr = this.createDecentrConnector(api);

    return from(decentr.setPublicProfile(walletAddress, publicProfile, {
      broadcast: true,
      privateKey,
    }));
  }

  public setUserPrivate(
    privateProfile: Partial<UserPrivate>,
    api: string,
    walletAddress: Wallet['address'],
    privateKey: Wallet['privateKey'],
  ): Observable<BroadcastResponse> {
    const decentr = this.createDecentrConnector(api);

    return from(decentr.setPrivateProfile(walletAddress, privateProfile, privateKey, {
      broadcast: true,
    }));
  }

  private createDecentrConnector(api: string): Decentr {
    return new Decentr(api, this.environment.chainId);
  }
}

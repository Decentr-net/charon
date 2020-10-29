import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Decentr, signMessage } from 'decentr-js';

import { Environment } from '@environments/environment.definitions';
import { Account, UserPrivate, UserPublic } from './user-api.definitions';

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

  public getAccount(api: string, walletAddress: string): Observable<Account> {
    const decentr = this.createDecentrConnector(api);
    return from(decentr.get.account(walletAddress)) as Observable<Account>;
  }

  public getUserPrivate(api: string, walletAddress: string, privateKey: string): Observable<UserPrivate> {
    const decentr = this.createDecentrConnector(api);
    return from(decentr.get.privateProfile({ privateKey, address: walletAddress })) as Observable<UserPrivate>;
  }

  public getUserPublic(api: string, walletAddress: string): Observable<UserPublic> {
    const decentr = this.createDecentrConnector(api);
    return from(decentr.get.publicProfile(walletAddress)) as Observable<UserPublic>;
  }

  public setUserPublic(
    data: UserPublic,
    api: string,
    walletAddress: string,
    privateKey: string,
  ): Observable<unknown> {
    const decentr = this.createDecentrConnector(api);
    return from(decentr.setPublicProfile(walletAddress, data)).pipe(
      mergeMap((message) => this.broadcast(decentr, message, privateKey)),
    );
  }

  public setUserPrivate(
    data: UserPrivate,
    api: string,
    walletAddress: string,
    privateKey: string,
  ): Observable<unknown> {
    const decentr = this.createDecentrConnector(api);
    return from(decentr.setPrivateProfile(data, { privateKey, address: walletAddress })).pipe(
      mergeMap((message) => this.broadcast(decentr, message, privateKey)),
    )
  }

  private broadcast(decentr: any, message: unknown, privateKey: string): Promise<void> {
    const signedMsg = signMessage(message, privateKey);
    return decentr.broadcastTx(signedMsg);
  }

  private createDecentrConnector(api: string): any {
    return new Decentr(api, this.environment.chainId);
  }
}

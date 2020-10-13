import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Decentr, signMessage } from 'decentr-js';

import { Environment } from '@environments/environment.definitions';
import { Gender, UserPublic } from './user-api.definitions';

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

  public getAccount(chainId: string, walletAddress: string): Observable<Account> {
    const decentr = this.createDecentrConnector(chainId);
    return from(decentr.get.account(walletAddress)) as Observable<Account>;
  }

  public getUserPrivate({}: string): Observable<string> {
    return of(JSON.stringify({
      emails: [],
      usernames: [],
    }));
  }

  public getUserPublic({}: string): Observable<string> {
    return of(JSON.stringify({
      gender: Gender.Male,
      birthday: '',
    }));
  }

  public setUserPublic(
    data: UserPublic,
    chainId: string,
    walletAddress: string,
    privateKey: string,
  ): Observable<unknown> {
    const decentr = this.createDecentrConnector(chainId);
    return from(decentr.setPublicProfile(walletAddress, data)).pipe(
      tap((message) => this.broadcast(decentr, message, privateKey)),
    );
  }

  public setUserPrivate(
    data: UserPublic,
    chainId: string,
    walletAddress: string,
    privateKey: string,
  ): Observable<unknown> {
    const decentr = this.createDecentrConnector(chainId);
    return from(decentr.setPrivateProfile(walletAddress, data)).pipe(
      tap((message) => this.broadcast(decentr, message, privateKey)),
    )
  }

  private broadcast(decentr: any, message: unknown, privateKey: string): void {
    const signedMsg = signMessage(message, privateKey);
    decentr.broadcastTx(signedMsg);
  }

  private createDecentrConnector(chainId: string): any {
    return new Decentr(this.environment.restApi, chainId);
  }
}

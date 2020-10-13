import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Decentr, signMessage } from 'decentr-js';

import { Environment } from '@environments/environment.definitions';
import { GetUserPrivateResponse, GetUserPublicResponse, UserPublic } from './user-api.definitions';

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

  public getUserPrivate(walletAddress: string): Observable<string> {
    const url = `${this.environment.restApi}/profile/private/${walletAddress}`;

    return this.http.get<GetUserPrivateResponse>(url).pipe(
      map((response) => response.result),
    );
  }

  public getUserPublic(walletAddress: string): Observable<UserPublic> {
    const url = `${this.environment.restApi}/profile/public/${walletAddress}`;

    return this.http.get<GetUserPublicResponse>(url).pipe(
      map((response) => response.result),
    );
  }

  public setUserPublic(
    data: UserPublic,
    chainId: string,
    walletAddress: string,
    privateKey: string,
  ): Observable<unknown> {
    const decentr = this.createDecentrConnector(chainId);
    return from(decentr.setPublicProfile(walletAddress, data)).pipe(
      mergeMap((message) => this.broadcast(decentr, message, privateKey)),
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
      mergeMap((message) => this.broadcast(decentr, message, privateKey)),
    )
  }

  private broadcast(decentr: any, message: unknown, privateKey: string): Promise<void> {
    const signedMsg = signMessage(message, privateKey);
    return decentr.broadcastTx(signedMsg);
  }

  private createDecentrConnector(chainId: string): any {
    return new Decentr(this.environment.restApi, chainId);
  }
}

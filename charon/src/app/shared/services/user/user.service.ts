import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, map, retryWhen } from 'rxjs/operators';
import { decryptWithPrivatekey, encryptWithPrivatekey } from 'decentr-js';

import { ChainService } from '@shared/services/chain';
import { UserApiService } from './user-api.service';
import { UserPrivate, UserPublic } from './user-api.definitions';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private chainService: ChainService,
    private userApiService: UserApiService,
  ) {
  }

  public createUser(email: string, walletAddress: string): Observable<void> {
    return this.userApiService.createUser(email, walletAddress);
  }

  public confirmUser(code: string, email: string): Observable<void> {
    return this.userApiService.confirmUser(code, email);
  }

  public getAccount(walletAddress: string): Observable<Account> {
    return this.userApiService.getAccount(this.chainService.getChainId(), walletAddress);
  }

  public waitAccount(walletAddress: string): Observable<Account> {
    return this.getAccount(walletAddress).pipe(
      retryWhen(errors => errors.pipe(
        delay(200),
      )),
    );
  }

  public getUserPrivate(walletAddress: string, privateKey: string): Observable<UserPrivate> {
    return this.userApiService.getUserPrivate(walletAddress).pipe(
      map((encryptedData) => decryptWithPrivatekey(encryptedData, privateKey))
    );
  }

  public getUserPublic(walletAddress: string): Observable<UserPublic> {
    return this.userApiService.getUserPublic(walletAddress);
  }

  public setUserPublic(data: UserPublic, walletAddress: string, privateKey: string): Observable<unknown> {
    return this.userApiService.setUserPublic(
      data,
      this.chainService.getChainId(),
      walletAddress,
      privateKey,
    );
  }

  public setUserPrivate(data: UserPrivate, walletAddress: string, privateKey: string): Observable<unknown> {
    const encryptedData = encryptWithPrivatekey(data, privateKey)
    return this.userApiService.setUserPrivate(
      encryptedData,
      this.chainService.getChainId(),
      walletAddress,
      privateKey,
    );
  }
}

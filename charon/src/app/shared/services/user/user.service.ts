import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, map, retryWhen, take } from 'rxjs/operators';

import { NetworkService } from '@shared/services/network';
import { UserApiService } from './user-api.service';
import { Account, UserPrivate, UserPublic } from './user-api.definitions';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private networkService: NetworkService,
    private userApiService: UserApiService,
  ) {
  }

  public createUser(email: string, walletAddress: string): Observable<void> {
    return this.userApiService.createUser(email, walletAddress);
  }

  public confirmUser(code: string, email: string): Observable<void> {
    return this.userApiService.confirmUser(code, email);
  }

  public getAccount(walletAddress: string): Observable<Account | undefined> {
    return this.userApiService.getAccount(
      this.networkService.getActiveNetworkInstant().api,
      walletAddress,
    ).pipe(
      map(account => account.address ? account : void 0),
    );
  }

  public waitAccount(walletAddress: string): Observable<Account> {
    return this.getAccount(walletAddress).pipe(
      retryWhen(errors => errors.pipe(
        delay(200),
        take(5),
      )),
    );
  }

  public getUserPrivate(walletAddress: string, privateKey: string): Observable<UserPrivate> {
    return this.userApiService.getUserPrivate(
      this.networkService.getActiveNetworkInstant().api,
      walletAddress,
      privateKey,
    );
  }

  public getUserPublic(walletAddress: string): Observable<UserPublic> {
    return this.userApiService.getUserPublic(
      this.networkService.getActiveNetworkInstant().api,
      walletAddress,
    );
  }

  public setUserPublic(data: UserPublic, walletAddress: string, privateKey: string): Observable<unknown> {
    return this.userApiService.setUserPublic(
      data,
      this.networkService.getActiveNetworkInstant().api,
      walletAddress,
      privateKey,
    );
  }

  public setUserPrivate(data: UserPrivate, walletAddress: string, privateKey: string): Observable<unknown> {
    return this.userApiService.setUserPrivate(
      data,
      this.networkService.getActiveNetworkInstant().api,
      walletAddress,
      privateKey,
    );
  }
}

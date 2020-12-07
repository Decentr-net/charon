import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, mapTo, retryWhen, take } from 'rxjs/operators';
import { Account, PublicProfile } from 'decentr-js';

import { UserPrivate } from '@shared/services/auth';
import { NetworkService } from '../network';
import { UserApiService } from '../api';

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

  public getPrivateProfile(walletAddress: string, privateKey: string): Observable<UserPrivate> {
    return this.userApiService.getPrivateProfile(
      this.networkService.getActiveNetworkInstant().api,
      walletAddress,
      privateKey,
    );
  }

  public getPublicProfile(walletAddress: string): Observable<PublicProfile> {
    return this.userApiService.getPublicProfile(
      this.networkService.getActiveNetworkInstant().api,
      walletAddress,
    );
  }

  public setPublicProfile(publicProfile: PublicProfile, walletAddress: string, privateKey: string): Observable<void> {
    return this.userApiService.setPublicProfile(
      publicProfile,
      this.networkService.getActiveNetworkInstant().api,
      walletAddress,
      privateKey,
    ).pipe(
      mapTo(void 0),
    );
  }

  public setPrivateProfile(privateProfile: UserPrivate, walletAddress: string, privateKey: string): Observable<void> {
    return this.userApiService.setPrivateProfile(
      privateProfile,
      this.networkService.getActiveNetworkInstant().api,
      walletAddress,
      privateKey,
    ).pipe(
      mapTo(void 0),
    );
  }
}

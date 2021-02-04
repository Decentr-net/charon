import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { delay, repeat, retryWhen, skipWhile, take } from 'rxjs/operators';
import { Account, ModeratorAddressesResponse, PublicProfile } from 'decentr-js';

import { MessageBus } from '@shared/message-bus';
import { UserPrivate } from '@shared/services/auth';
import { CharonAPIMessageBusMap } from '@scripts/background/charon-api';
import { MessageCode } from '@scripts/messages';
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

  public getModeratorAddresses(): Observable<ModeratorAddressesResponse> {
    return this.userApiService.getModeratorAddresses(
      this.networkService.getActiveNetworkInstant().api,
    );
  }

  public waitAccount(walletAddress: string): Observable<Account> {
    return this.getAccount(walletAddress).pipe(
      retryWhen(errors => errors.pipe(
        delay(500),
        take(5),
      )),
      delay(500),
      repeat(),
      skipWhile(v => v === undefined),
      take(1),
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
    return from(new MessageBus<CharonAPIMessageBusMap>()
      .sendMessage(MessageCode.PublicProfileUpdate, {
        privateKey,
        publicProfile,
        walletAddress,
      })
      .then(response => {
        if (!response.success) {
          throw response.error;
        }
      }));
  }

  public setPrivateProfile(privateProfile: UserPrivate, walletAddress: string, privateKey: string): Observable<void> {
    return from(new MessageBus<CharonAPIMessageBusMap>()
      .sendMessage(MessageCode.PrivateProfileUpdate, {
        privateKey,
        privateProfile,
        walletAddress,
      })
      .then(response => {
        if (!response.success) {
          throw response.error;
        }
      }));
  }
}

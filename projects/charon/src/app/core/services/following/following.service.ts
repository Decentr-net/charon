import { Injectable } from '@angular/core';
import { BehaviorSubject, defer, Observable } from 'rxjs';
import { Wallet } from 'decentr-js';

import { MessageBus } from '@shared/message-bus';
import { CharonAPIMessageBusMap } from '@scripts/background/charon-api';
import { MessageCode } from '@scripts/messages';
import { AuthService } from '@core/auth';
import { FollowingApiService } from '../api';
import { NetworkService } from '../network';

@Injectable()
export class FollowingService {
  public static isFollowingUpdating$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private authService: AuthService,
    private followingApiService: FollowingApiService,
    private networkService: NetworkService,
  ) {
  }

  public follow(whom: Wallet['address']): Observable<void> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    return defer(() => {
      FollowingService.isFollowingUpdating$.next(true);

      return new MessageBus<CharonAPIMessageBusMap>()
        .sendMessage(MessageCode.Follow, {
          follower: wallet.address,
          whom,
          privateKey: wallet.privateKey
        })
        .then(response => {
          FollowingService.isFollowingUpdating$.next(false);

          if (!response.success) {
            throw response.error;
          }
        })
    });
  }

  public unfollow(whom: Wallet['address']): Observable<void> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    return defer(() => {
      FollowingService.isFollowingUpdating$.next(true);

      return new MessageBus<CharonAPIMessageBusMap>()
        .sendMessage(MessageCode.Unfollow, {
          follower: wallet.address,
          whom,
          privateKey: wallet.privateKey
        })
        .then(response => {
          FollowingService.isFollowingUpdating$.next(false);

          if (!response.success) {
            throw response.error;
          }
        });
    });
  }

  public getFollowees(follower: Wallet['address']): Observable<Wallet['address'][]> {
    return this.followingApiService.getFollowees(
      this.networkService.getActiveNetworkInstant().api,
      follower,
    );
  }
}

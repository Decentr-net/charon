import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, defer, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DecentrCommunityClient, Wallet } from 'decentr-js';

import { MessageBus } from '@shared/message-bus';
import { assertMessageResponseSuccess, CharonAPIMessageBusMap } from '@scripts/background/charon-api';
import { MessageCode } from '@scripts/messages';
import { AuthService } from '@core/auth';
import { NetworkService } from '../network';

@Injectable()
export class FollowingService {
  public static isFollowingUpdating$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private authService: AuthService,
    private networkService: NetworkService,
  ) {
  }

  public follow(whom: Wallet['address']): Observable<void> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    FollowingService.isFollowingUpdating$.next(true);

    return defer(() => new MessageBus<CharonAPIMessageBusMap>()
      .sendMessage(MessageCode.Follow, {
        request: {
          owner: wallet.address,
          whom,
        },
        privateKey: wallet.privateKey,
      })
    ).pipe(
      map((response) => {
        FollowingService.isFollowingUpdating$.next(false);

        assertMessageResponseSuccess(response);
      }),
    );
  }

  public unfollow(whom: Wallet['address']): Observable<void> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    FollowingService.isFollowingUpdating$.next(true);

    return defer(() => new MessageBus<CharonAPIMessageBusMap>()
      .sendMessage(MessageCode.Unfollow, {
        request: {
          owner: wallet.address,
          whom,
        },
        privateKey: wallet.privateKey,
      })
    ).pipe(
      map((response) => {
        FollowingService.isFollowingUpdating$.next(false);

        assertMessageResponseSuccess(response);
      }),
    );
  }

  public getFollowees(): Observable<Wallet['address'][]> {
    return combineLatest([
      this.createClient(),
      this.authService.getActiveUserAddress(),
    ]).pipe(
      switchMap(([client, walletAddress]) => client.getFollowees(walletAddress)),
    );
  }

  private createClient(): Promise<DecentrCommunityClient> {
    const api = this.networkService.getActiveNetworkAPIInstant();

    return DecentrCommunityClient.create(api);
  }
}

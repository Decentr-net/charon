import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, defer, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Wallet } from 'decentr-js';

import { MessageBus } from '@shared/message-bus';
import { assertMessageResponseSuccess, CharonAPIMessageBusMap } from '@scripts/background/charon-api/message-bus-map';
import { MessageCode } from '@scripts/messages';
import { AuthService } from '../../auth';
import { DecentrService } from '../decentr';

@Injectable()
export class FollowingService {
  public static isFollowingUpdating$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private authService: AuthService,
    private decentrService: DecentrService,
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
      this.decentrService.decentrClient,
      this.authService.getActiveUserAddress(),
    ]).pipe(
      switchMap(([decentrClient, walletAddress]) => decentrClient.community.getFollowees(walletAddress)),
    );
  }
}

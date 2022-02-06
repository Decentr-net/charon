import { Injectable } from '@angular/core';
import { combineLatest, defer, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  Coin,
  QueryDelegationTotalRewardsResponse,
  Validator,
} from 'decentr-js';

import { MessageBus } from '@shared/message-bus';
import { assertMessageResponseSuccess, CharonAPIMessageBusMap } from '@scripts/background/charon-api/message-bus-map';
import { MessageCode } from '@scripts/messages';
import { AuthService } from '../../auth';
import { DecentrService } from '../decentr';

@Injectable()
export class DistributionService {
  constructor(
    private authService: AuthService,
    private decentrService: DecentrService,
  ) {
  }

  public getDelegatorRewards(): Observable<QueryDelegationTotalRewardsResponse> {
    return combineLatest([
      this.decentrService.decentrClient,
      this.authService.getActiveUserAddress(),
    ]).pipe(
      switchMap(([client, walletAddress]) => client.distribution.getDelegatorRewards(
        walletAddress,
      )),
    )
  }

  public getValidatorRewards(): Observable<Coin[]> {
    return combineLatest([
      this.decentrService.decentrClient,
      this.authService.getActiveUser()
    ]).pipe(
      switchMap(([client, user]) => client.distribution.getValidatorCommission(user.wallet.validatorAddress)),
      map((commission) => {
        const coinsMap = [...commission]
          .reduce((acc, coin) => ({ ...acc, [coin.denom]: (acc[coin.denom] || 0) + (+coin.amount || 0) }), {});

        return Object.entries(coinsMap)
          .map(([denom, amount]) => ({ denom, amount: amount.toString() }));
      }),
    );
  }

  public getTotalDelegatorRewards(): Observable<Coin[]> {
    return this.getDelegatorRewards().pipe(
      map((rewards) => rewards.total),
    );
  }

  public calculateWithdrawDelegatorRewardsFee(
    validatorAddresses: Validator['operatorAddress'][],
  ): Observable<number> {
    return combineLatest([
      this.decentrService.decentrClient,
      this.authService.getActiveUser()
    ]).pipe(
      switchMap(([client, user]) => {
        const requests = validatorAddresses
          .map((validatorAddress) => ({ validatorAddress, delegatorAddress: user.wallet.address }));

        return client.distribution.withdrawDelegatorRewards(requests).simulate();
      }),
    );
  }

  public withdrawDelegatorRewards(
    validatorAddresses: Validator['operatorAddress'][],
  ): Observable<void> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    const request = validatorAddresses.map((validatorAddress) => ({
      delegatorAddress: wallet.address,
      validatorAddress,
    }))

    return defer(() => new MessageBus<CharonAPIMessageBusMap>()
      .sendMessage(MessageCode.WithdrawDelegatorRewards, {
        request,
        privateKey: wallet.privateKey,
      })
    ).pipe(
      map(assertMessageResponseSuccess),
    );
  }

  public withdrawValidatorRewards(): Observable<void> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    return defer(() => new MessageBus<CharonAPIMessageBusMap>()
      .sendMessage(MessageCode.WithdrawValidatorRewards, {
        request: {
          validatorAddress: wallet.validatorAddress,
        },
        privateKey: wallet.privateKey,
      })
    ).pipe(
      map(assertMessageResponseSuccess),
    );
  }

  public calculateWithdrawValidatorRewardsFee(): Observable<number> {
    return combineLatest([
      this.decentrService.decentrClient,
      this.authService.getActiveUser()
    ]).pipe(
      switchMap(([client, user]) => {
        return client.distribution.withdrawValidatorRewards(
          {
            validatorAddress: user.wallet.validatorAddress,
          },
        ).simulate();
      }),
    );
  }
}

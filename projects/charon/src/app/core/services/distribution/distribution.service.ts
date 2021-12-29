import { Injectable } from '@angular/core';
import { combineLatest, defer, forkJoin, Observable, of, ReplaySubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  Coin,
  DecentrDistributionClient,
  QueryDelegationTotalRewardsResponse,
  Validator,
} from 'decentr-js';

import { MessageBus } from '@shared/message-bus';
import { assertMessageResponseSuccess, CharonAPIMessageBusMap } from '@scripts/background/charon-api';
import { MessageCode } from '@scripts/messages';
import { AuthService } from '../../auth';
import { NetworkService } from '../network';

@Injectable()
export class DistributionService {
  private client: ReplaySubject<DecentrDistributionClient> = new ReplaySubject(1);

  constructor(
    private authService: AuthService,
    private networkService: NetworkService,
  ) {
    this.createClient()
      .then(client => this.client.next(client));
  }

  public getDelegatorRewards(): Observable<QueryDelegationTotalRewardsResponse> {
    return combineLatest([
      this.client,
      this.authService.getActiveUserAddress(),
    ]).pipe(
      switchMap(([client, walletAddress]) => client.getDelegatorRewards(
        walletAddress,
      )),
    )
  }

  public getValidatorRewards(): Observable<Coin[]> {
    return combineLatest([
      this.client,
      this.authService.getActiveUser()
    ]).pipe(
      switchMap(([client, user]) => forkJoin([
        client.getValidatorCommission(user.wallet.validatorAddress),
        client.getValidatorOutstandingRewards(user.wallet.validatorAddress),
      ])),
      map(([commission, outstandingRewards]) => {
        const coinsMap = [...commission, ...outstandingRewards]
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
      this.client,
      this.authService.getActiveUser()
    ]).pipe(
      switchMap(([client, user]) => {
        const requests = validatorAddresses
          .map((validatorAddress) => ({ validatorAddress, delegatorAddress: user.wallet.address }));

        return client.withdrawDelegatorRewards(requests, user.wallet.privateKey).simulate();
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
    return of(0);
  }

  private createClient(): Promise<DecentrDistributionClient> {
    const api = this.networkService.getActiveNetworkAPIInstant();

    return DecentrDistributionClient.create(api);
  }
}

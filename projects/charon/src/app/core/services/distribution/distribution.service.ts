import { Injectable } from '@angular/core';
import { combineLatest, defer, Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';
import { calculateWithdrawDelegatorRewardsFee, DelegatorRewards, DenomAmount, Validator, Wallet } from 'decentr-js';

import { AuthService } from '../../auth';
import { DistributionApiService } from '../api';
import { NetworkService } from '../network';
import { ConfigService } from '@shared/services/configuration';
import { MessageBus } from '@shared/message-bus';
import { CharonAPIMessageBusMap } from '@scripts/background/charon-api';
import { MessageCode } from '@scripts/messages';

@Injectable()
export class DistributionService {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private distributionApiService: DistributionApiService,
    private networkService: NetworkService,
  ) {
  }

  public getDelegatorRewards(
    validatorAddress?: Validator['operator_address'],
  ): Observable<DelegatorRewards | DenomAmount[]> {
    return combineLatest([
      this.authService.getActiveUser().pipe(
        pluck('wallet', 'address'),
      ),
      this.networkService.getActiveNetworkAPI(),
    ]).pipe(
      switchMap(([walletAddress, api]) => this.distributionApiService.getDelegatorRewards(
        api,
        walletAddress,
        validatorAddress,
      )),
    )
  }

  public getTotalDelegatorRewards(): Observable<number> {
    return this.getDelegatorRewards().pipe(
      map((rewards: DelegatorRewards) => +rewards?.total[0]?.amount || 0),
    );
  }

  public calculateWithdrawDelegatorRewardsFee(
    delegatorAddress: Wallet['address'],
    fromValidatorAddress?: Validator['operator_address'],
  ): Observable<number> {
    return this.configService.getChainId().pipe(
      switchMap((chainId) => defer(() => calculateWithdrawDelegatorRewardsFee(
        this.networkService.getActiveNetworkAPIInstant(),
        chainId,
        delegatorAddress,
        fromValidatorAddress,
      ))),
      map((fee) => +fee[0].amount),
    );
  }

  public createDistribution(
    fromValidatorAddress?: Validator['operator_address'],
  ): Observable<void> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    return defer(() => new MessageBus<CharonAPIMessageBusMap>()
      .sendMessage(MessageCode.WithdrawDelegatorRewards, {
        privateKey: wallet.privateKey,
        validatorAddress: fromValidatorAddress,
        walletAddress: wallet.address,
      })).pipe(
      map((response) => {
        if (!response.success) {
          throw response.error;
        }

        return void 0;
      }),
    );
  }
}

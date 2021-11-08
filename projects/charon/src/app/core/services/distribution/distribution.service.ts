import { Injectable } from '@angular/core';
import { combineLatest, defer, Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';
import {
  calculateWithdrawDelegatorRewardsFee,
  calculateWithdrawValidatorRewardsFee,
  DelegatorRewards,
  DenomAmount,
  Validator,
  ValidatorDistribution,
} from 'decentr-js';

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

  public getValidatorDistribution(
    validatorAddress: Validator['operator_address'],
  ): Observable<ValidatorDistribution> {
    return this.networkService.getActiveNetworkAPI().pipe(
      switchMap((api) => this.distributionApiService.getValidatorDistribution(api, validatorAddress)),
    );
  }

  public getTotalDelegatorRewards(): Observable<number> {
    return this.getDelegatorRewards().pipe(
      map((rewards: DelegatorRewards) => +(rewards?.total || [])[0]?.amount || 0),
    );
  }

  public calculateWithdrawDelegatorRewardsFee(
    fromValidatorAddress?: Validator['operator_address'],
  ): Observable<number> {
    const walletAddress = this.authService.getActiveUserInstant().wallet.address;

    return this.configService.getChainId().pipe(
      switchMap((chainId) => defer(() => calculateWithdrawDelegatorRewardsFee(
        this.networkService.getActiveNetworkAPIInstant(),
        chainId,
        walletAddress,
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
      })
    ).pipe(
      map((response) => {
        if (!response.success) {
          throw response.error;
        }

        return void 0;
      }),
    );
  }

  public withdrawValidatorRewards(
    fromValidatorAddress: Validator['operator_address'],
  ) {
    const wallet = this.authService.getActiveUserInstant().wallet;

    return defer(() => new MessageBus<CharonAPIMessageBusMap>()
      .sendMessage(MessageCode.WithdrawValidatorRewards, {
        privateKey: wallet.privateKey,
        validatorAddress: fromValidatorAddress,
        walletAddress: wallet.address,
      })
    ).pipe(
      map((response) => {
        if (!response.success) {
          throw response.error;
        }

        return void 0;
      }),
    );
  }

  public calculateWithdrawValidatorRewardsFee(
    fromValidatorAddress: Validator['operator_address'],
  ): Observable<number> {
    const walletAddress = this.authService.getActiveUserInstant().wallet.address;

    return this.configService.getChainId().pipe(
      switchMap((chainId) => defer(() => calculateWithdrawValidatorRewardsFee(
        this.networkService.getActiveNetworkAPIInstant(),
        chainId,
        walletAddress,
        fromValidatorAddress,
      ))),
      map((fee) => +fee[0].amount),
    );
  }
}

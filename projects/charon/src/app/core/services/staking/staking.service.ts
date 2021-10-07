import { Injectable } from '@angular/core';
import { defer, forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { calculateCreateDelegationFee, Delegation, Pool, Validator, ValidatorStatus } from 'decentr-js';

import { MessageBus } from '@shared/message-bus';
import { ConfigService } from '@shared/services/configuration';
import { MessageCode } from '@scripts/messages';
import { CharonAPIMessageBusMap } from '@scripts/background/charon-api';
import { AuthService } from '../../auth';
import { StakingApiService } from '../api';
import { NetworkService } from '../network';

const DENOM = 'udec';

@Injectable()
export class StakingService {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private stakingApiService: StakingApiService,
    private networkService: NetworkService,
  ) {
  }

  public createDelegation(validatorAddress: Validator['operator_address'], amount: string): Observable<void> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    return defer(() => new MessageBus<CharonAPIMessageBusMap>()
      .sendMessage(MessageCode.Delegate, {
        amount,
        validatorAddress,
        walletAddress: wallet.address,
        privateKey: wallet.privateKey
      })).pipe(
        map((response) => {
          if (!response.success) {
            throw response.error;
          }

          return void 0;
        }),
    );
  }

  public getDelegationFee(validatorAddress: Validator['operator_address'], amount: string): Observable<number> {
    return this.configService.getChainId().pipe(
      switchMap((chainId) => calculateCreateDelegationFee(
        this.networkService.getActiveNetworkAPIInstant(),
        chainId,
        {
          delegator_address: this.authService.getActiveUserInstant().wallet.address,
          validator_address: validatorAddress,
          amount: {
            amount,
            denom: DENOM,
          },
        },
      )),
      map((fee) => +fee[0]?.amount),
    );
  }

  public createRedelegation(
    fromValidatorAddress: Validator['operator_address'],
    toValidatorAddress: Validator['operator_address'],
    amount: string,
  ): Observable<void> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    return defer(() => new MessageBus<CharonAPIMessageBusMap>()
      .sendMessage(MessageCode.Redelegate, {
        amount,
        fromValidatorAddress,
        toValidatorAddress,
        walletAddress: wallet.address,
        privateKey: wallet.privateKey,
      })).pipe(
      map((response) => {
        if (!response.success) {
          throw response.error;
        }

        return void 0;
      }),
    );
  }

  public createUndelegation(validatorAddress: Validator['operator_address'], amount: string): Observable<void> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    return defer(() => new MessageBus<CharonAPIMessageBusMap>()
      .sendMessage(MessageCode.Undelegate, {
        amount,
        validatorAddress,
        walletAddress: wallet.address,
        privateKey: wallet.privateKey,
      })).pipe(
        map((response) => {
          if (!response.success) {
            throw response.error;
          }

          return void 0;
        }),
      );
  }

  public getDelegations(): Promise<Delegation[]>{
    return this.stakingApiService.getDelegations(
      this.networkService.getActiveNetworkAPIInstant(),
      this.authService.getActiveUserInstant().wallet.address,
    );
  }

  public getValidatorDelegation(validatorAddress: Validator['operator_address']): Promise<Delegation> {
    return this.stakingApiService.getValidatorDelegation(
      this.networkService.getActiveNetworkAPIInstant(),
      validatorAddress,
      this.authService.getActiveUserInstant().wallet.address,
    );
  }

  public getPool(): Promise<Pool> {
    return this.stakingApiService.getPool(
      this.networkService.getActiveNetworkAPIInstant(),
    );
  }

  public getValidators(onlyBonded: boolean = false): Observable<Validator[]> {
    const api = this.networkService.getActiveNetworkAPIInstant();

    return forkJoin([
      this.stakingApiService.getValidators(api),
      ...onlyBonded
        ? []
        : [
          this.stakingApiService.getValidators(api, { status: ValidatorStatus.Unbonding }),
          this.stakingApiService.getValidators(api, { status: ValidatorStatus.Unbonded }),
        ],
    ]).pipe(
      map(([bonded, unbonding, unbonded]) => [
        ...bonded,
        ...unbonding ? unbonding : [],
        ...unbonded ? unbonded : [],
      ]),
    );
  }

  public getValidator(address: Validator['operator_address']): Promise<Validator> {
    return this.stakingApiService.getValidator(
      this.networkService.getActiveNetworkAPIInstant(),
      address,
    );
  }
}

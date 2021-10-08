import { Injectable } from '@angular/core';
import { combineLatest, defer, forkJoin, Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';
import {
  calculateCreateDelegationFee,
  calculateCreateRedelegationFee,
  calculateCreateUnbondingDelegationFee,
  Delegation,
  Pool,
  Redelegation,
  Validator,
  ValidatorStatus,
} from 'decentr-js';

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

  public getDelegationFee(validatorAddress: Validator['operator_address'], amount: number): Observable<number> {
    return this.configService.getChainId().pipe(
      switchMap((chainId) => defer(() => calculateCreateDelegationFee(
        this.networkService.getActiveNetworkAPIInstant(),
        chainId,
        {
          delegator_address: this.authService.getActiveUserInstant().wallet.address,
          validator_address: validatorAddress,
          amount: {
            amount: amount.toString(),
            denom: DENOM,
          },
        },
      ))),
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

  public getRedelegationFee(
    fromValidatorAddress: Validator['operator_address'],
    toValidatorAddress: Validator['operator_address'],
    amount: string,
  ): Observable<number> {
    return this.configService.getChainId().pipe(
      switchMap((chainId) => defer(() => calculateCreateRedelegationFee(
        this.networkService.getActiveNetworkAPIInstant(),
        chainId,
        {
          delegator_address: this.authService.getActiveUserInstant().wallet.address,
          validator_src_address: fromValidatorAddress,
          validator_dst_address: toValidatorAddress,
          amount: {
            amount: amount.toString(),
            denom: DENOM,
          },
        },
      ))),
      map((fee) => +fee[0]?.amount),
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

  public getUndelegationFee(validatorAddress: Validator['operator_address'], amount: string): Observable<number> {
    return this.configService.getChainId().pipe(
      switchMap((chainId) => defer(() => calculateCreateUnbondingDelegationFee(
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
      ))),
      map((fee) => +fee[0]?.amount),
    );
  }

  public getDelegations(): Observable<Delegation[]>{
    return combineLatest([
      this.authService.getActiveUser().pipe(
        pluck('wallet', 'address'),
      ),
      this.networkService.getActiveNetworkAPI(),
    ]).pipe(
      switchMap(([walletAddress, api]) => this.stakingApiService.getDelegations(api, walletAddress)),
    );
  }

  public getValidatorDelegation(validatorAddress: Validator['operator_address']): Observable<Delegation> {
    return combineLatest([
      this.authService.getActiveUser().pipe(
        pluck('wallet', 'address'),
      ),
      this.networkService.getActiveNetworkAPI(),
    ]).pipe(
      switchMap(([walletAddress, api]) => this.stakingApiService.getValidatorDelegation(
        api,
        validatorAddress,
        walletAddress,
      )),
    );
  }

  public getRedelegations(toValidator: Validator['operator_address']): Observable<Redelegation[]> {
    return combineLatest([
      this.authService.getActiveUser().pipe(
        pluck('wallet', 'address'),
      ),
      this.networkService.getActiveNetworkAPI(),
    ]).pipe(
      switchMap(([walletAddress, api]) => this.stakingApiService.getRedelegations(
        api,
        {
          delegator: walletAddress,
          validator_to: toValidator,
        },
      )),
    );
  }

  public getRedelegationAvailableTime(fromValidator: Validator['operator_address']): Observable<number | undefined> {
    return this.getRedelegations(fromValidator).pipe(
      map((redelegation) => redelegation[0]?.entries || []),
      map((entries) => entries.map((entry) => Date.parse(entry.completion_time))),
      map((times) => times.sort((left, right) => right - left)),
      map((sortedTimesDesc) => sortedTimesDesc[0]),
    );
  }

  public getPool(): Observable<Pool> {
    return this.networkService.getActiveNetworkAPI().pipe(
      switchMap((api) => this.stakingApiService.getPool(api)),
    );
  }

  public getValidators(onlyBonded: boolean = false): Observable<Validator[]> {
    return this.networkService.getActiveNetworkAPI().pipe(
      switchMap((api) => forkJoin([
        this.stakingApiService.getValidators(api),
        ...onlyBonded
          ? []
          : [
            this.stakingApiService.getValidators(api, { status: ValidatorStatus.Unbonding }),
            this.stakingApiService.getValidators(api, { status: ValidatorStatus.Unbonded }),
          ],
      ])),
      map(([bonded, unbonding, unbonded]) => [
        ...bonded,
        ...unbonding ? unbonding : [],
        ...unbonded ? unbonded : [],
      ]),
    );
  }

  public getValidator(address: Validator['operator_address']): Observable<Validator> {
    return this.networkService.getActiveNetworkAPI().pipe(
      switchMap((api) => this.stakingApiService.getValidator(api, address)),
    );
  }
}

import { Injectable } from '@angular/core';
import { combineLatest, defer, forkJoin, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, pluck, switchMap } from 'rxjs/operators';
import {
  Coin,
  DecentrStakingClient,
  DelegateTokensRequest,
  DelegationResponse,
  Pool,
  RedelegationResponse,
  RedelegateTokensRequest,
  StakingParams,
  UnbondingDelegation,
  UnbondingDelegationEntry,
  UndelegateTokensRequest,
  Validator,
  protoTimestampToDate,
} from 'decentr-js';

import { MessageBus } from '@shared/message-bus';
import { ConfigService } from '@shared/services/configuration';
import { MessageCode } from '@scripts/messages';
import { assertMessageResponseSuccess, CharonAPIMessageBusMap } from '@scripts/background/charon-api';
import { AuthService } from '../../auth';
import { NetworkService } from '../network';

@Injectable()
export class StakingService {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private networkService: NetworkService,
  ) {
  }

  public delegateTokens(request: Omit<DelegateTokensRequest, 'delegatorAddress'>): Observable<void> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    return defer(() => new MessageBus<CharonAPIMessageBusMap>()
      .sendMessage(MessageCode.Delegate, {
        request: {
          ...request,
          delegatorAddress: wallet.address,
        },
        privateKey: wallet.privateKey,
      })).pipe(
        map(assertMessageResponseSuccess),
      );
  }

  public getDelegationFee(request: Omit<DelegateTokensRequest, 'delegatorAddress'>): Observable<number> {
    return combineLatest([
      DecentrStakingClient.create(this.networkService.getActiveNetworkAPIInstant()),
      this.authService.getActiveUser(),
    ]).pipe(
      switchMap(([client, user]) => client.delegateTokens({
        ...request,
        delegatorAddress: user.wallet.address,
      }, user.wallet.privateKey).simulate()),
    );
  }

  public redelegateTokens(
    request: Omit<RedelegateTokensRequest, 'delegatorAddress'>,
  ): Observable<void> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    return defer(() => new MessageBus<CharonAPIMessageBusMap>()
      .sendMessage(MessageCode.Redelegate, {
        request: {
          ...request,
          delegatorAddress: wallet.address,
        },
        privateKey: wallet.privateKey,
      })).pipe(
        map(assertMessageResponseSuccess),
      );
  }

  public getRedelegationFee(
    request: Omit<RedelegateTokensRequest, 'delegatorAddress'>,
  ): Observable<number> {
    return combineLatest([
      DecentrStakingClient.create(this.networkService.getActiveNetworkAPIInstant()),
      this.authService.getActiveUser(),
    ]).pipe(
      switchMap(([client, user]) => client.redelegateTokens({
        ...request,
        delegatorAddress: user.wallet.address,
      }, user.wallet.privateKey).simulate()),
    );
  }

  public getValidatorUndelegation(
    validatorAddress: Validator['operatorAddress'],
  ): Observable<UnbondingDelegationEntry[]> {
    return combineLatest([
      this.createClient(),
      this.authService.getActiveUserAddress(),
    ]).pipe(
      switchMap(([client, walletAddress]) => client.getUnbondingDelegation(walletAddress, validatorAddress)),
      map((response: UnbondingDelegation) => response.entries),
      catchError(() => of([])),
    );
  }

  public undelegateTokens(validatorAddress: Validator['operatorAddress'], amount: Coin): Observable<void> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    return defer(() => new MessageBus<CharonAPIMessageBusMap>()
      .sendMessage(MessageCode.Undelegate, {
        request: {
          delegatorAddress: wallet.address,
          validatorAddress,
          amount,
        },
        privateKey: wallet.privateKey,
      })).pipe(
        map(assertMessageResponseSuccess),
      );
  }

  public getUndelegationFee(request: Omit<UndelegateTokensRequest, 'delegatorAddress'>,): Observable<number> {
    return combineLatest([
      DecentrStakingClient.create(this.networkService.getActiveNetworkAPIInstant()),
      this.authService.getActiveUser(),
    ]).pipe(
      switchMap(([client, user]) => client.undelegateTokens({
        ...request,
        delegatorAddress: user.wallet.address,
      }, user.wallet.privateKey).simulate()),
    );
  }

  public getUndedelegationFromAvailableTime(fromValidator: Validator['operatorAddress']): Observable<number | undefined> {
    return combineLatest([
      this.getUndelegationsTimes(fromValidator),
      this.getStakingParameters().pipe(
        pluck('max_entries'),
      ),
    ]).pipe(
      map(([times, maxEntries]) => times.length >= maxEntries ? times : []),
      map((times) => times.sort((left, right) => left.valueOf() - right.valueOf())),
      map((sortedTimesDesc) => sortedTimesDesc[0].valueOf()),
    );
  }

  public getUnbondingDelegations(): Observable<UnbondingDelegation[]> {
    return combineLatest([
      this.createClient(),
      this.authService.getActiveUserAddress(),
    ]).pipe(
      switchMap(([client, walletAddress]) => client.getUnbondingDelegations(walletAddress)),
    );
  }

  public getUnbondingDelegation(
    validatorAddress: Validator['operatorAddress'],
  ): Observable<UnbondingDelegationEntry[]> {
    return combineLatest([
      this.createClient(),
      this.authService.getActiveUserAddress(),
    ]).pipe(
      switchMap(([client, walletAddress]) => client.getUnbondingDelegation(walletAddress, validatorAddress)),
      map((response) => response.entries),
    );
  }

  public getDelegations(): Observable<DelegationResponse[]> {
    return combineLatest([
      this.createClient(),
      this.authService.getActiveUserAddress(),
    ]).pipe(
      switchMap(([client, walletAddress]) => client.getDelegations(walletAddress)),
    );
  }

  public getValidatorDelegation(validatorAddress: Validator['operatorAddress']): Observable<Coin> {
    return combineLatest([
      this.createClient(),
      this.authService.getActiveUserAddress(),
    ]).pipe(
      switchMap(([client, walletAddress]) => client.getDelegation(
        walletAddress,
        validatorAddress,
      )),
    );
  }

  public getRedelegations(
    sourceValidatorAddress: Validator['operatorAddress'],
    destinationValidatorAddress: Validator['operatorAddress'],
  ): Observable<RedelegationResponse[]> {
    return combineLatest([
      this.createClient(),
      this.authService.getActiveUserAddress(),
    ]).pipe(
      switchMap(([client, walletAddress]) => client.getRedelegations(
        walletAddress,
        sourceValidatorAddress,
        destinationValidatorAddress,
      )),
    );
  }

  public getRedelegationFromAvailableTime(validatorSrcAddress: Validator['operatorAddress']): Observable<number | undefined> {
    return this.getRedelegationsTimes(validatorSrcAddress, undefined).pipe(
      map((times) => times.sort((left, right) => right - left)),
      map((sortedTimesDesc) => sortedTimesDesc[0]),
    );
  }

  public getRedelegationToAvailableTime(
    validatorSrcAddress: Validator['operatorAddress'],
    validatorDstAddress: Validator['operatorAddress'],
  ): Observable<number | undefined> {
    return combineLatest([
      this.getRedelegationsTimes(
        validatorSrcAddress,
        validatorDstAddress,
      ),
      this.getStakingParameters().pipe(
        pluck('max_entries')
      ),
    ]).pipe(
      map(([times, maxEntries]) => times.length >= maxEntries ? times : []),
      map((times) => times.sort((left, right) => left - right)),
      map((sortedTimesDesc) => sortedTimesDesc[0]),
    );
  }

  public getPool(): Observable<Pool> {
    return defer(() => this.createClient()).pipe(
      mergeMap((client) => client.getPool()),
    );
  }

  public getValidators(onlyBonded: boolean = false): Observable<Validator[]> {
    return defer(() => this.createClient()).pipe(
      mergeMap((client) => forkJoin([
        client.getValidators('BOND_STATUS_BONDED'),
        ...onlyBonded
          ? []
          : [
            client.getValidators('BOND_STATUS_UNBONDING'),
            client.getValidators('BOND_STATUS_UNBONDED'),
          ],
      ])),
      map(([bonded, unbonding, unbonded]) => [
        ...bonded,
        ...unbonding ? unbonding : [],
        ...unbonded ? unbonded : [],
      ]),
    );
  }

  public getValidator(address: Validator['operatorAddress']): Observable<Validator> {
    return defer(() => this.createClient()).pipe(
      mergeMap((client) => client.getValidator(address)),
    );
  }

  public getStakingParameters(): Observable<StakingParams> {
    return defer(() => this.createClient()).pipe(
      mergeMap((client) => client.getStakingParameters()),
    );
  }

  private getUndelegationsTimes(fromValidator: Validator['operatorAddress']): Observable<Date[]> {
    return this.getValidatorUndelegation(fromValidator).pipe(
      map((entries ) => entries.map((entry) => protoTimestampToDate(entry.completionTime))),
    );
  }

  private getRedelegationsTimes(
    validatorSrcAddress: Validator['operatorAddress'],
    validatorDstAddress: Validator['operatorAddress'],
  ): Observable<number[]> {
    return this.getRedelegations(validatorSrcAddress, validatorDstAddress).pipe(
      map((redelegations) => redelegations
        .reduce((acc, item) => [...acc, ...item.entries], [])
      ),
      map((entries) => entries.map((entry) => Date.parse(entry.completion_time))),
    );
  }

  private createClient(): Promise<DecentrStakingClient> {
    const api = this.networkService.getActiveNetworkAPIInstant();

    return DecentrStakingClient.create(api);
  }
}

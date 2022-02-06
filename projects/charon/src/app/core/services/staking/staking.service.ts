import { Injectable } from '@angular/core';
import { combineLatest, defer, forkJoin, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import {
  Coin,
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
import { MessageCode } from '@scripts/messages';
import { assertMessageResponseSuccess, CharonAPIMessageBusMap } from '@scripts/background/charon-api/message-bus-map';
import { AuthService } from '../../auth';
import { DecentrService } from '../decentr';

@Injectable()
export class StakingService {
    constructor(
    private authService: AuthService,
    private decentrService: DecentrService,
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
      this.decentrService.decentrClient,
      this.authService.getActiveUser(),
    ]).pipe(
      switchMap(([decentrClient, user]) => decentrClient.staking.delegateTokens({
        ...request,
        delegatorAddress: user.wallet.address,
      }).simulate()),
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
      this.decentrService.decentrClient,
      this.authService.getActiveUser(),
    ]).pipe(
      switchMap(([decentrClient, user]) => decentrClient.staking.redelegateTokens({
        ...request,
        delegatorAddress: user.wallet.address,
      }).simulate()),
    );
  }

  public getValidatorUndelegation(
    validatorAddress: Validator['operatorAddress'],
  ): Observable<UnbondingDelegationEntry[]> {
    return combineLatest([
      this.decentrService.decentrClient,
      this.authService.getActiveUserAddress(),
    ]).pipe(
      switchMap(([decentrClient, walletAddress]) => decentrClient.staking.getUnbondingDelegation(walletAddress, validatorAddress)),
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
      this.decentrService.decentrClient,
      this.authService.getActiveUser(),
    ]).pipe(
      switchMap(([decentrClient, user]) => decentrClient.staking.undelegateTokens({
        ...request,
        delegatorAddress: user.wallet.address,
      }).simulate()),
    );
  }

  public getUndedelegationFromAvailableTime(fromValidator: Validator['operatorAddress']): Observable<number | undefined> {
    return combineLatest([
      this.getUndelegationsTimes(fromValidator),
      this.getStakingParameters().pipe(
        map((params) => params.maxEntries),
      ),
    ]).pipe(
      map(([times, maxEntries]) => times.length >= maxEntries ? times : []),
      map((times) => times.sort((left, right) => left.valueOf() - right.valueOf())),
      map((sortedTimesDesc) => sortedTimesDesc[0]?.valueOf()),
    );
  }

  public getUnbondingDelegations(): Observable<UnbondingDelegation[]> {
    return combineLatest([
      this.decentrService.decentrClient,
      this.authService.getActiveUserAddress(),
    ]).pipe(
      switchMap(([decentrClient, walletAddress]) => decentrClient.staking.getUnbondingDelegations(walletAddress)),
    );
  }

  public getUnbondingDelegation(
    validatorAddress: Validator['operatorAddress'],
  ): Observable<UnbondingDelegationEntry[]> {
    return combineLatest([
      this.decentrService.decentrClient,
      this.authService.getActiveUserAddress(),
    ]).pipe(
      switchMap(([decentrClient, walletAddress]) => decentrClient.staking.getUnbondingDelegation(walletAddress, validatorAddress)),
      map((response) => response.entries),
    );
  }

  public getDelegations(): Observable<DelegationResponse[]> {
    return combineLatest([
      this.decentrService.decentrClient,
      this.authService.getActiveUserAddress(),
    ]).pipe(
      switchMap(([decentrClient, walletAddress]) => decentrClient.staking.getDelegations(walletAddress)),
    );
  }

  public getValidatorDelegation(validatorAddress: Validator['operatorAddress']): Observable<Coin> {
    return combineLatest([
      this.decentrService.decentrClient,
      this.authService.getActiveUserAddress(),
    ]).pipe(
      switchMap(([decentrClient, walletAddress]) => decentrClient.staking.getDelegation(
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
      this.decentrService.decentrClient,
      this.authService.getActiveUserAddress(),
    ]).pipe(
      switchMap(([decentrClient, walletAddress]) => decentrClient.staking.getRedelegations(
        walletAddress,
        sourceValidatorAddress,
        destinationValidatorAddress,
      )),
      catchError(() => of([])),
    );
  }

  public getRedelegationFromAvailableTime(validatorSrcAddress: Validator['operatorAddress']): Observable<number | undefined> {
    return this.getRedelegationsTimes('', validatorSrcAddress).pipe(
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
        map(({ maxEntries }) => maxEntries),
      ),
    ]).pipe(
      map(([times, maxEntries]) => times.length >= maxEntries ? times : []),
      map((times) => times.sort((left, right) => left - right)),
      map((sortedTimesDesc) => sortedTimesDesc[0]),
    );
  }

  public getPool(): Observable<Pool> {
    return this.decentrService.decentrClient.pipe(
      mergeMap((decentrClient) => decentrClient.staking.getPool()),
    );
  }

  public getValidators(onlyBonded: boolean = false): Observable<Validator[]> {
    return this.decentrService.decentrClient.pipe(
      map((decentrClient) => decentrClient.staking),
      mergeMap((stakingClient) => forkJoin([
        stakingClient.getValidators('BOND_STATUS_BONDED'),
        ...onlyBonded
          ? []
          : [
            stakingClient.getValidators('BOND_STATUS_UNBONDING'),
            stakingClient.getValidators('BOND_STATUS_UNBONDED'),
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
    return this.decentrService.decentrClient.pipe(
      mergeMap((decentrClient) => decentrClient.staking.getValidator(address)),
    );
  }

  public getStakingParameters(): Observable<StakingParams> {
    return this.decentrService.decentrClient.pipe(
      mergeMap((decentrClient) => decentrClient.staking.getStakingParameters()),
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
      map((redelegationResponses) => redelegationResponses.filter(({ redelegation }) => {
        return (!validatorSrcAddress || redelegation.validatorSrcAddress === validatorSrcAddress)
          && (!validatorDstAddress || redelegation.validatorDstAddress === validatorDstAddress);
      })),
      map((redelegations) => redelegations.reduce((acc, item) => [...acc, ...item.entries], [])),
      map((entries: RedelegationResponse['entries']) => {
        return entries
          .map((entry) => protoTimestampToDate(entry.redelegationEntry?.completionTime).valueOf())
          .filter(Boolean);
      }),
    );
  }
}

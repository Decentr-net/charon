import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, of, timer } from 'rxjs';
import { map, mapTo, shareReplay, switchMap, switchMapTo, take, tap } from 'rxjs/operators';
import { createDecentrCoin, Validator } from 'decentr-js';

import { MICRO_PDV_DIVISOR } from '@shared/pipes/micro-value';
import { AuthService } from '@core/auth';
import { BankService, NetworkService, StakingService } from '@core/services';

@Injectable()
export class RedelegatePageService {
  public validators$: Observable<Validator[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private bankService: BankService,
    private networkService: NetworkService,
    private router: Router,
    private stakingService: StakingService,
  ) {

    this.validators$ = this.stakingService.getValidators(true).pipe(
      shareReplay(1),
    );
  }

  public get minRedelegateAmount(): number {
    return 1 / MICRO_PDV_DIVISOR;
  }

  public getBalance(): Observable<number> {
    return this.bankService.getDECBalance().pipe(
      map(parseFloat),
    );
  }

  public getDelegatedAmount(validatorAddress: Validator['operatorAddress']): Observable<number> {
    return this.stakingService.getValidatorDelegation(validatorAddress).pipe(
      map((coin) => +coin.amount || 0),
    );
  }

  public getValidator(address: Validator['operatorAddress']): Observable<Validator> {
    return this.stakingService.getValidator(address);
  }

  public getValidators(): Observable<Validator[]> {
    return this.validators$;
  }

  public getRedelegationFee(
    validatorSrcAddress: Validator['operatorAddress'],
    validatorDstAddress: Validator['operatorAddress'],
    amount: string,
  ): Observable<number> {
    return this.stakingService.getRedelegationFee({
      validatorSrcAddress,
      validatorDstAddress,
      amount: createDecentrCoin(amount),
    });
  }

  public redelegate(
    validatorSrcAddress: Validator['operatorAddress'],
    validatorDstAddress: Validator['operatorAddress'],
    amount: number | string,
  ): Observable<void> {
    return this.stakingService.redelegateTokens({
      validatorSrcAddress,
      validatorDstAddress,
      amount: createDecentrCoin(amount),
    });
  }

  public navigateBack(): void {
    this.router.navigate(['../../'], {
      relativeTo: this.activatedRoute,
    });
  }

  public createAsyncAmountValidator(
    delegatedAmount$: Observable<number>,
  ): AsyncValidatorFn {
    return (amountControl) => {
      const amount = parseFloat(amountControl.value.toString());

      if (isNaN(amount)) {
        return of(null);
      }

      return timer(300).pipe(
        switchMapTo(delegatedAmount$),
        take(1),
        map((delegatedAmount) => {
          return delegatedAmount / MICRO_PDV_DIVISOR >= amount ? null : { insufficient: false };
        }),
      );
    };
  }

  public createAsyncBalanceValidator(
    amountControl: AbstractControl,
    fee$: Observable<number>,
  ): AsyncValidatorFn {
    return () => {
      const amount = parseFloat(amountControl.value.toString());

      if (isNaN(amount)) {
        return of(null);
      }

      return timer(300).pipe(
        switchMap(() => combineLatest([
          this.getBalance(),
          fee$,
        ])),
        take(1),
        tap(([balance, fee]) => {
          const error = balance > fee ? null : { insufficientBalance: false };
          const amountErrors = amountControl.errors || error;
          amountControl.setErrors(amountErrors);
        }),
        mapTo(null),
      );
    };
  }

  public createValidatorValidator(): ValidatorFn {
    return (control) => {
      if (!control.value) {
        return null;
      }

      return typeof control.value === 'object'
        ? null
        : { isValidator: false };
    };
  }

  public getRedelegationFromAvailableTime(fromValidator: Validator['operatorAddress']): Observable<number | undefined> {
    return this.stakingService.getRedelegationFromAvailableTime(fromValidator);
  }

  public getRedelegationToAvailableTime(
    fromValidator: Validator['operatorAddress'],
    toValidator: Validator['operatorAddress'],
  ): Observable<number | undefined> {
    return this.stakingService.getRedelegationToAvailableTime(fromValidator, toValidator);
  }
}

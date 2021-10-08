import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, defer, Observable, timer } from 'rxjs';
import { map, mapTo, pluck, switchMap, switchMapTo, take, tap } from 'rxjs/operators';
import { ValidatorFn } from '@ngneat/reactive-forms';
import { Validator } from 'decentr-js';

import { MICRO_PDV_DIVISOR } from '@shared/pipes/micro-value';
import { AuthService } from '@core/auth';
import { BankService, NetworkService, StakingService } from '@core/services';


@Injectable()
export class UndelegatePageService {
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private bankService: BankService,
    private networkService: NetworkService,
    private router: Router,
    private stakingService: StakingService,
  ) {
  }

  public get minUnelegateAmount(): number {
    return 1 / MICRO_PDV_DIVISOR;
  }

  public getBalance(): Observable<number> {
    return combineLatest([
      this.authService.getActiveUser().pipe(
        pluck('wallet', 'address'),
      ),
      this.networkService.getActiveNetworkAPI(),
    ]).pipe(
      switchMap(([walletAddress]) => this.bankService.getDECBalance(walletAddress)),
      map((balance) => +balance),
    );
  }

  public getDelegatedAmount(validatorAddress: Validator['operator_address']): Observable<number> {
    return combineLatest([
      this.authService.getActiveUser().pipe(
        pluck('wallet', 'address'),
      ),
      this.networkService.getActiveNetworkAPI(),
    ]).pipe(
      switchMap(() => this.stakingService.getValidatorDelegation(validatorAddress)),
      map((delegation) => +delegation?.balance.amount || 0),
    );
  }
  public getUndelegationFee(
    validatorAddress: Validator['operator_address'],
    amount: string,
  ): Observable<number> {
    return this.stakingService.getUndelegationFee(validatorAddress, amount);
  }

  public getValidator(address: Validator['operator_address']): Observable<Validator> {
    return defer(() => this.stakingService.getValidator(address));
  }

  public undelegate(validatorAddress: Validator['operator_address'], amount: string): Observable<void> {
    return this.stakingService.createUndelegation(
      validatorAddress,
      amount,
    );
  }

  public navigateBack(): void {
    this.router.navigate(['../../'], {
      relativeTo: this.activatedRoute,
    });
  }

  public createAsyncAmountValidator(
    delegatedAmount$: Observable<number>,
  ): ValidatorFn<string> {
    return (amountControl) => {
      const amount = parseFloat(amountControl.value.toString());

      if (isNaN(amount)) {
        return null;
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
  ): ValidatorFn<string> {
    return () => {
      const amount = parseFloat(amountControl.value.toString());

      if (isNaN(amount)) {
        return null;
      }

      return timer(300).pipe(
        switchMap(() => combineLatest([
          this.getBalance(),
          fee$,
        ])),
        take(1),
        tap(([balance, fee]) => {
          const error = (balance - fee) / MICRO_PDV_DIVISOR >= amount ? null : { insufficientBalance: false };
          const amountErrors = amountControl.errors || error;
          amountControl.setErrors(amountErrors);
        }),
        mapTo(null),
      );
    };
  }
}
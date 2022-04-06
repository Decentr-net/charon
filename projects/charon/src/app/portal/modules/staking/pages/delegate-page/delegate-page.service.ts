import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, of, timer } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { createDecentrCoin, Validator } from 'decentr-js';

import { MICRO_PDV_DIVISOR } from '@shared/pipes/micro-value';
import { AuthService } from '@core/auth';
import { BankService, NetworkService, StakingService } from '@core/services';

@Injectable()
export class DelegatePageService {
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private bankService: BankService,
    private networkService: NetworkService,
    private router: Router,
    private stakingService: StakingService,
  ) {
  }

  public get minDelegateAmount(): number {
    return 1 / MICRO_PDV_DIVISOR;
  }

  public getBalance(): Observable<number> {
    return this.bankService.getDECBalance().pipe(
      map(parseFloat),
    );
  }

  public getDelegationFee(
    validatorAddress: Validator['operatorAddress'],
    amount: number,
  ): Observable<number> {
    return this.stakingService.getDelegationFee({
      validatorAddress,
      amount: createDecentrCoin(amount),
    });
  }

  public getValidator(address: Validator['operatorAddress']): Observable<Validator> {
    return this.stakingService.getValidator(address);
  }

  public delegate(validatorAddress: Validator['operatorAddress'], amount: number | string): Observable<void> {
    return this.stakingService.delegateTokens({
      validatorAddress,
      amount: createDecentrCoin(amount),
    });
  }

  public navigateBack(): void {
    this.router.navigate(['../../'], {
      relativeTo: this.activatedRoute,
    });
  }

  public createAsyncAmountValidator(
    amountControl: AbstractControl,
    balance$: Observable<number>,
    fee$: Observable<number | string>,
  ): AsyncValidatorFn {
    return () => {
      const amount = parseFloat(amountControl.value.toString());

      if (isNaN(amount)) {
        return of(null);
      }

      return timer(300).pipe(
        switchMap(() => combineLatest([
          balance$,
          fee$,
        ])),
        take(1),
        tap(([balance, fee]) => {
          const error = (balance - +fee) / MICRO_PDV_DIVISOR >= amount ? null : { insufficient: false };
          amountControl.setErrors(error);
        }),
        map(() => null),
      );
    };
  }
}

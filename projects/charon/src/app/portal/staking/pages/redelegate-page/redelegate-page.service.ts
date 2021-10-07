import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, defer, Observable, timer } from 'rxjs';
import { map, pluck, shareReplay, switchMap, switchMapTo, take } from 'rxjs/operators';
import { ValidatorFn } from '@ngneat/reactive-forms';
import { Validator } from 'decentr-js';

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

  public getValidator(address: Validator['operator_address']): Observable<Validator> {
    return defer(() => this.stakingService.getValidator(address));
  }

  public getValidators(): Observable<Validator[]> {
    return this.validators$;
  }

  public redelegate(
    fromValidatorAddress: Validator['operator_address'],
    toValidatorAddress: Validator['operator_address'],
    amount: string,
  ): Observable<void> {
    return this.stakingService.createRedelegation(
      fromValidatorAddress,
      toValidatorAddress,
      amount,
    );
  }

  public navigateBack(): void {
    this.router.navigate(['../../'], {
      relativeTo: this.activatedRoute,
    });
  }

  public createAsyncAmountValidator(
    balance$: Observable<number>,
  ): ValidatorFn<string> {
    return (amountControl) => {
      const amount = parseFloat(amountControl.value.toString());

      if (isNaN(amount)) {
        return null;
      }

      return timer(300).pipe(
        switchMapTo(balance$),
        take(1),
        map((balance) => {
          return balance / MICRO_PDV_DIVISOR >= amount ? null : { insufficient: false };
        }),
      );
    };
  }

  public createValidatorValidator(): ValidatorFn<Validator> {
    return (control) => {
      if (!control.value) {
        return null;
      }

      return typeof control.value === 'object'
        ? null
        : { isValidator: false };
    };
  }

}

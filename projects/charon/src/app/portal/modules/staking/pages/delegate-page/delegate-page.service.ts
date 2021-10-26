import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, timer } from 'rxjs';
import { filter, map, mapTo, pluck, switchMap, take, tap } from 'rxjs/operators';
import { Validator } from 'decentr-js';

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
    return combineLatest([
      this.authService.getActiveUser().pipe(
        pluck('wallet', 'address'),
        filter((walletAddress) => !!walletAddress),
      ),
      this.networkService.getActiveNetworkAPI(),
    ]).pipe(
      switchMap(([walletAddress]) => this.bankService.getDECBalance(walletAddress)),
      map((balance) => +balance),
    );
  }

  public getDelegationFee(
    validatorAddress: Validator['operator_address'],
    amount: number,
  ): Observable<number> {
    return this.stakingService.getDelegationFee(validatorAddress, amount);
  }

  public getValidator(address: Validator['operator_address']): Observable<Validator> {
    return this.stakingService.getValidator(address);
  }

  public delegate(validatorAddress: Validator['operator_address'], amount: string): Observable<void> {
    return this.stakingService.createDelegation(
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
    amountControl: AbstractControl,
    balance$: Observable<number>,
    fee$: Observable<number | string>,
  ): AsyncValidatorFn {
    return () => {
      const amount = parseFloat(amountControl.value.toString());

      if (isNaN(amount)) {
        return null;
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
        mapTo(null),
      );
    };
  }
}
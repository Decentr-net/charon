import { Injectable } from '@angular/core';
import { combineLatest, defer, Observable, timer } from 'rxjs';
import { map, mapTo, mergeMapTo, pluck, switchMap, take, tap } from 'rxjs/operators';
import { Validator } from 'decentr-js';

import { AuthService } from '@core/auth';
import { BankService, NetworkService, StakingService } from '@core/services';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidatorFn } from '@ngneat/reactive-forms';
import { MICRO_PDV_DIVISOR } from '../../../../../../../../shared/pipes/micro-value';
import { AbstractControl } from '@angular/forms';

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
    amountControl: AbstractControl,
    balance$: Observable<number>,
  ): ValidatorFn<string> {
    return () => {
      const amount = parseFloat(amountControl.value.toString());

      if (isNaN(amount)) {
        return null;
      }

      return timer(300).pipe(
        mergeMapTo(balance$),
        take(1),
        tap((balance) => {
          const error = balance / MICRO_PDV_DIVISOR >= amount ? null : { insufficient: false };
          amountControl.setErrors(error);
        }),
        mapTo(null),
      );
    };
  }
}

import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { combineLatest, Observable, of, timer } from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  take,
  tap,
} from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { createDecentrCoin, Wallet } from 'decentr-js';

import { MICRO_PDV_DIVISOR } from '@shared/pipes/micro-value';
import { NotificationService } from '@shared/services/notification';
import { AuthService } from '@core/auth';
import { BankService, UserService } from '@core/services';

@Injectable()
export class TransferPageService {
  constructor(
    private authService: AuthService,
    private bankService: BankService,
    private notificationService: NotificationService,
    private translocoService: TranslocoService,
    private userService: UserService,
  ) {
  }

  public getBalance(): Observable<number> {
    return this.bankService.getDECBalance().pipe(
      map(parseFloat),
    );
  }

  public getTransferFee(toAddress: Wallet['address'], amount: number | string): Observable<number> {
    return this.bankService.getTransferFee({ amount: [createDecentrCoin(amount)], toAddress });
  }

  public createAsyncValidWalletAddressValidator(): AsyncValidatorFn {
    return (control) => {
      if (!control.value) {
        return of(null);
      }

      if (control.value === this.authService.getActiveUserInstant().wallet.address) {
        return of({ myAddress: false });
      }

      return timer(300).pipe(
        mergeMap(() => this.userService.getAccount(control.value)),
        catchError(() => of(undefined)),
        map((account) => account ? null : { exists: false }),
      );
    };
  }

  public createAsyncAmountValidator(
    amountControl: AbstractControl,
    fee$: Observable<number>,
  ): AsyncValidatorFn {
    return () => {
      const amount = parseFloat(amountControl.value.toString());

      if (isNaN(amount)) {
        return of(null);
      }

      return timer(300).pipe(
        mergeMap(() => combineLatest([
          this.getBalance(),
          fee$,
        ])),
        take(1),
        tap(([balance, fee]) => {
          const error = (balance - fee) / MICRO_PDV_DIVISOR >= amount ? null : { insufficient: false };
          amountControl.setErrors(error);
        }),
        map(() => null),
      );
    };
  }

  public transfer(toAddress: Wallet['address'], amount: number, memo?: string): Observable<void> {
    return this.bankService.transferCoins({
      amount: [createDecentrCoin(amount)],
      toAddress,
    }, memo).pipe(
      tap({
        next: () => this.notificationService.success(
          this.translocoService.translate('transfer_page.notifications.success', null, 'portal'),
        ),
        error: (error) => this.notificationService.error(error),
      }),
    );
  }
}

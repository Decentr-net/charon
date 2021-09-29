import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { combineLatest, Observable, of, timer } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  map,
  mapTo,
  mergeMapTo,
  pluck,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { AsyncValidatorFn } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { Wallet } from 'decentr-js';

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
    return this.authService.getActiveUser().pipe(
      pluck('wallet', 'address'),
      distinctUntilChanged(),
      switchMap((walletAddress) => this.bankService.getDECBalance(walletAddress)),
      map(parseFloat),
    );
  }

  public getTransferFee(to: Wallet['address'], amount: number): Observable<number> {
    return this.bankService.getTransferFee(to, amount.toString());
  }

  public createAsyncValidWalletAddressValidator(): AsyncValidatorFn<Wallet['address']> {
    return (control) => {
      if (!control.value) {
        return null;
      }

      if (control.value === this.authService.getActiveUserInstant().wallet.address) {
        return of({ myAddress: false });
      }

      return timer(300).pipe(
        mergeMapTo(this.userService.getAccount(control.value)),
        catchError(() => of(undefined)),
        map((account) => account ? null : { exists: false }),
      );
    };
  }

  public createAsyncAmountValidator(
    amountControl: AbstractControl,
    fee$: Observable<number>,
  ): AsyncValidatorFn<number> {
    return () => {
      const amount = parseFloat(amountControl.value.toString());

      if (isNaN(amount)) {
        return null;
      }

      return timer(300).pipe(
        mergeMapTo(combineLatest([
          this.getBalance(),
          fee$,
        ])),
        take(1),
        tap(([balance, fee]) => {
          const error = (balance - fee) / MICRO_PDV_DIVISOR >= amount ? null : { insufficient: false };
          amountControl.setErrors(error);
        }),
        mapTo(null),
      );
    };
  }

  public transfer(to: Wallet['address'], amount: number, comment?: string): Observable<void> {
    return this.bankService.transferCoins(to, amount.toString(), comment).pipe(
      tap(() => {
        this.notificationService.success(
          this.translocoService.translate('transfer_page.notifications.success', null, 'portal'),
        );
      }, (error) => {
        this.notificationService.error(error);
      }),
    );
  }
}

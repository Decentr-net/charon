import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  map,
  mergeMapTo,
  pluck,
  switchMap,
  take,
  tap
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
  public balance$: Observable<number>;

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

  public createAsyncAmountValidator(): AsyncValidatorFn<number> {
    return (control) => {
      const amount = parseFloat(control.value.toString());

      if (isNaN(amount)) {
        return null;
      }

      return timer(300).pipe(
        mergeMapTo(this.getBalance()),
        take(1),
        map((balance) => balance / MICRO_PDV_DIVISOR >= amount ? null : { insufficient: false }),
      );
    };
  }

  public transfer(to: Wallet['address'], amount: number): Observable<void> {
    return this.bankService.transferCoins(to, amount.toString()).pipe(
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

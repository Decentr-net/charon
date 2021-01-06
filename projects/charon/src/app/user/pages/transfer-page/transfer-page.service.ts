import { Injectable } from '@angular/core';
import { of, ReplaySubject, timer } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { AsyncValidatorFn } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Wallet } from 'decentr-js';

import { AuthService } from '@core/auth';
import { BankService, UserService } from '@core/services';

@UntilDestroy()
@Injectable()
export class TransferPageService {
  private decBalance: ReplaySubject<number> = new ReplaySubject(1);

  constructor(
    private userService: UserService,
    private bankService: BankService,
    authService: AuthService,
  ) {
    this.bankService.getDECBalance(authService.getActiveUserInstant().wallet.address).pipe(
      untilDestroyed(this),
    ).subscribe((balance) => this.decBalance.next(parseFloat(balance)));
  }

  public createAsyncWalletAddressValidator(): AsyncValidatorFn<Wallet['address']> {
    return (control) => {
      if (!control.value) {
        return of(null);
      }

      return timer(300).pipe(
        switchMap(() => this.userService.getAccount(control.value).pipe(
          catchError(() => of(undefined)),
          map((account) => {
            if (!account) {
              return { exists: false };
            }
          }),
        )),
      );
    };
  }

  public createAsyncAmountValidator(): AsyncValidatorFn<number> {
    return (control) => {
      const amount = parseFloat(control.value.toString());

      if (isNaN(amount)) {
        return of(null);
      }

      return timer(300).pipe(
        switchMap(() => this.decBalance.pipe(
          map((balance) => {
            if (balance < amount * 1000 * 1000) {
              return { insufficient: false };
            }
          }),
          take(1),
        )),
      );
    };
  }
}

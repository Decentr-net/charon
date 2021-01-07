import { Injectable } from '@angular/core';
import { from, Observable, of, ReplaySubject, timer } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { AsyncValidatorFn } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TransferData, Wallet } from 'decentr-js';

import { AuthService } from '@core/auth';
import { CharonAPIMessageBusMap } from '@scripts/background/charon-api';
import { BankService, UserService } from '@core/services';
import { MessageBus } from '@shared/message-bus';
import { MessageCode } from '@scripts/messages';

@UntilDestroy()
@Injectable()
export class TransferPageService {
  private decBalance: ReplaySubject<number> = new ReplaySubject(1);

  constructor(
    private userService: UserService,
    private bankService: BankService,
    private authService: AuthService,
  ) {
    this.bankService.getDECBalance(authService.getActiveUserInstant().wallet.address).pipe(
      untilDestroyed(this),
    ).subscribe((balance) => this.decBalance.next(parseFloat(balance)));
  }

  public createAsyncWalletAddressValidator(): AsyncValidatorFn<string> {
    return (control) => {
      if (!control.value) {
        return of(null);
      }


    };
  }

  public createAsyncValidWalletAddressValidator(): AsyncValidatorFn<Wallet['address']> {
    return (control) => {
      if (!control.value) {
        return of(null);
      }

      if (control.value === this.authService.getActiveUserInstant().wallet.address) {
        return of({ myAddress: false });
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
            if (balance / 1000000 < amount) {
              return { insufficient: false };
            }
          }),
          take(1),
        )),
      );
    };
  }

  public sendCoin(transferData: TransferData, privateKey: string): Observable<void> {
    return from(new MessageBus<CharonAPIMessageBusMap>()
      .sendMessage(MessageCode.CoinTransfer, {
        transferData,
        privateKey: privateKey,
      })
      .then(response => {
        if (!response.success) {
          throw response.error;
        }
      }));
  }
}

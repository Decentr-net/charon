import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { combineLatest, Observable, of, switchMap, timer } from 'rxjs';
import { catchError, map, mergeMap, take, tap } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { createDecentrCoin, Wallet, WalletAddressVerifier, WalletPrefix } from 'decentr-js';

import { AuthService } from '@core/auth';
import { BankService, IbcRequestParams, UserService } from '@core/services';
import { FormControlWarn } from '@shared/forms';
import { MICRO_PDV_DIVISOR } from '@shared/pipes/micro-value';
import { NotificationService } from '@shared/services/notification';

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
    if (WalletAddressVerifier.verify(toAddress, WalletPrefix.Sentinel)) {
      return this.bankService.getTransferIbcFee({ token: createDecentrCoin(amount), receiver: toAddress });
    }

    return this.bankService.getTransferFee({ amount: [createDecentrCoin(amount)], toAddress });
  }

  public createAsyncValidWalletAddressValidator(): AsyncValidatorFn {
    return (control: FormControlWarn<string>) => {
      if (!control.value) {
        return of(null);
      }

      if (control.value === this.authService.getActiveUserInstant().wallet.address) {
        return of({ myAddress: false });
      }

      if (WalletAddressVerifier.verify(control.value, WalletPrefix.Sentinel)) {
        return of(undefined);
      }

      if (!WalletAddressVerifier.verify(control.value, WalletPrefix.Decentr)) {
        return of({ invalidAddress: false });
      }

      return timer(300).pipe(
        mergeMap(() => this.userService.getAccount(control.value)),
        catchError(() => of(undefined)),
        map((account) => account ? null : { exists: false }),
        tap((warning) => control.warnings = warning),
        map(() => undefined),
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
    return of(toAddress).pipe(
      switchMap((address) => WalletAddressVerifier.verify(address, 'sent')
        ? this.transferIbcTokens(toAddress, amount, memo)
        : this.transferCoins(toAddress, amount, memo),
      ),
      tap({
        next: () => this.notificationService.success(
          this.translocoService.translate('transfer_page.notifications.success', null, 'portal'),
        ),
        error: (error) => this.notificationService.error(error),
      }),
    );
  }

  public transferCoins(toAddress: Wallet['address'], amount: number, memo?: string): Observable<void> {
    return this.bankService.transferCoins({
      amount: [createDecentrCoin(amount)],
      toAddress,
    }, memo);
  }

  public transferIbcTokens(toAddress: Wallet['address'], amount: number, memo?: string): Observable<void> {
    return this.bankService.sendIbcTokens({
      receiver: toAddress,
      sender: this.authService.getActiveUserInstant().wallet.address,
      sourcePort: IbcRequestParams.port.Transfer,
      sourceChannel: IbcRequestParams.channel.DecentrSentinel,
      timeoutSec: IbcRequestParams.timeout,
      token: createDecentrCoin(amount),
    }, memo);
  }
}

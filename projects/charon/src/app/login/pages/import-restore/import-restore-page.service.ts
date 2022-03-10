import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AsyncValidatorFn } from '@angular/forms';
import { defer, Observable, of, timer } from 'rxjs';
import { catchError, map, mergeMap, switchMapTo, tap } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { createWalletFromMnemonic } from 'decentr-js';

import { NetworkId } from '@shared/services/configuration';
import { BrowserType, detectBrowser } from '@shared/utils/browser';
import { ReferralService, UserService } from '@core/services';
import { AuthService } from '@core/auth';
import { LockService } from '@core/lock';

@Injectable()
export class ImportRestorePageService {
  constructor(
    private authService: AuthService,
    private lockService: LockService,
    private referralService: ReferralService,
    private router: Router,
    private translocoService: TranslocoService,
    private userService: UserService,
  ) {
  }

  public importUser(seedPhrase: string, password: string, skipTrackInstall = false): Observable<void> {
    const wallet = createWalletFromMnemonic(seedPhrase);

    return defer(() => this.authService.createUser({
      wallet,
      password,
      seed: seedPhrase,
    })).pipe(
      mergeMap((id) => this.authService.changeUser(id)),
      mergeMap(() => (!skipTrackInstall && detectBrowser() === BrowserType.Decentr)
        ? this.referralService.trackInstall(wallet.address)
        : of(void 0)
      ),
      mergeMap(() => this.userService.createTestnetAccount(wallet.address)),
    );
  }

  public restoreUser(seedPhrase: string, password: string): Observable<void> {
    const activeUser = this.authService.getActiveUserInstant();

    return this.importUser(seedPhrase, password, true).pipe(
      mergeMap(() => {
        const userId = activeUser && activeUser.id;
        return userId
          ? this.authService.removeUser(userId)
          : of(void 0);
      }),
      mergeMap(() => this.lockService.unlock()),
    );
  }

  public createSeedAsyncValidator(): AsyncValidatorFn {
    return (control) => {
      if (!control.value) {
        return of(null);
      }

      const wallet = createWalletFromMnemonic(control.value);

      return timer(300).pipe(
        switchMapTo(this.userService.getAccount(wallet.address, NetworkId.Mainnet)),
        catchError(() => of(undefined)),
        map((account) => account ? null : { exists: false }),
        tap((error) => control.setErrors(error)),
      );
    };
  }
}

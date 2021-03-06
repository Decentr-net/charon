import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { delay, mapTo, mergeMap, mergeMapTo } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { createWalletFromMnemonic } from 'decentr-js';

import { UserService } from '@core/services';
import { AuthService } from '@core/auth';
import { LockService } from '@core/lock';
import { TranslatedError } from '@core/notifications';
import { ONE_SECOND } from '../../../../../../../shared/utils/date';

@Injectable()
export class ImportRestorePageService {
  constructor(
    private authService: AuthService,
    private lockService: LockService,
    private router: Router,
    private translocoService: TranslocoService,
    private userService: UserService,
  ) {
  }

  public importUser(seedPhrase: string, password: string): Observable<void> {
    const wallet = createWalletFromMnemonic(seedPhrase);

    return this.userService.getAccount(wallet.address).pipe(
      mergeMap((account) => {
        return account
          ? of(account)
          : throwError(new TranslatedError(this.translocoService.translate(
            'import_restore_page.errors.account_not_found',
            null,
            'login'
          )));
      }),
      mergeMapTo(forkJoin([
        this.userService.getPrivateProfile(wallet.address, wallet.privateKey),
        this.userService.getPublicProfile(wallet.address),
        this.userService.getModeratorAddresses(),
      ])),
      mergeMap(([privateProfile, publicProfile, moderatorAddresses]) => this.authService.createUser({
          ...privateProfile,
          ...publicProfile,
          isModerator: moderatorAddresses.includes(wallet.address) || undefined,
          wallet,
          password,
          emailConfirmed: true,
        })),
      mergeMap((id) => this.authService.changeUser(id)),
      mapTo(void 0),
    );
  }

  public restoreUser(seedPhrase: string, password: string): Observable<void> {
    const activeUser = this.authService.getActiveUserInstant();

    return this.importUser(seedPhrase, password).pipe(
      delay(ONE_SECOND / 2), // hack for mozilla
      mergeMap(() => {
        const userId = activeUser && activeUser.id;
        return userId
          ? this.authService.removeUser(userId)
          : of(void 0);
      }),
      mergeMap(() => this.lockService.unlock()),
    );
  }
}

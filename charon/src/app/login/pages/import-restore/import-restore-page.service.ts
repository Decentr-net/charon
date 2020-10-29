import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, forkJoin, Observable, of, throwError } from 'rxjs';
import { mapTo, mergeMap, mergeMapTo, tap } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { createWalletFromMnemonic } from 'decentr-js';

import { AuthService } from '@auth/services';
import { LockService } from '@shared/features/lock';
import { CustomError } from '@shared/models/error';
import { UserService } from '@shared/services/user';
import { AppRoute } from '../../../app-route';

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
    const { privateKey, publicKey, address: walletAddress } = createWalletFromMnemonic(seedPhrase);

    return this.userService.getAccount(walletAddress).pipe(
      mergeMap((account) => {
        return account
          ? of(account)
          : throwError(new CustomError(this.translocoService.translate(
            'import_restore_page.errors.account_not_found',
            null,
            'login'
          )))
      }),
      mergeMapTo(forkJoin([
        this.userService.getUserPrivate(walletAddress, privateKey),
        this.userService.getUserPublic(walletAddress),
      ])),
      mergeMap(([userPrivate, userPublic]) => this.authService.createUser({
        ...userPrivate,
        ...userPublic,
        password,
        privateKey,
        publicKey,
        walletAddress,
        emailConfirmed: true,
      })),
      mergeMap((id) => this.authService.changeUser(id)),
      tap(() => this.lockService.unlock()),
      mergeMap(() => this.router.navigate([AppRoute.User])),
      mapTo(void 0)
    );
  }

  public restoreUser(seedPhrase: string, password: string): Observable<void> {
    return this.importUser(seedPhrase, password).pipe(
      mergeMap(() => {
        const activeUser = this.authService.getActiveUserInstant();
        const userId = activeUser && activeUser.id;
        return userId
          ? this.authService.removeUser(userId)
          : EMPTY;
      })
    );
  }
}

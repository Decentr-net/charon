import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, forkJoin, Observable, of } from 'rxjs';
import { catchError, mapTo, mergeMap, take, tap } from 'rxjs/operators';
import { createWalletFromMnemonic } from 'decentr-js';

import { AuthService } from '@auth/services';
import { LockService } from '@shared/features/lock';
import { UserService } from '@shared/services/user';
import { AppRoute } from '../../../app-route';
import { ToastrService } from 'ngx-toastr';
import { TranslocoService } from '@ngneat/transloco';

@Injectable()
export class ImportRestorePageService {
  constructor(
    private authService: AuthService,
    private lockService: LockService,
    private router: Router,
    private toastrService: ToastrService,
    private translocoService: TranslocoService,
    private userService: UserService,
  ) {
  }

  public importUser(seedPhrase: string, password: string): Observable<void> {
    const { privateKey, publicKey, address: walletAddress } = createWalletFromMnemonic(seedPhrase);

    return forkJoin([
      this.userService.getUserPrivate(walletAddress, privateKey),
      this.userService.getUserPublic(walletAddress),
    ]).pipe(
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
      mapTo(void 0),
      catchError(error => {
        this.toastrService.error(this.translocoService.translate('import_restore_page.toastr.unknown_error', null, 'login'));
        throw new Error(error);
      }),
    );
  }

  public restoreUser(seedPhrase: string, password: string): Observable<void> {
    return this.authService.getActiveUser().pipe(
      take(1),
      mergeMap((user) => {
        const userId = user && user.id;
        return userId
          ? this.authService.removeUser(userId)
          : EMPTY;
      }),
      mergeMap(() => this.importUser(seedPhrase, password)),
    );
  }
}

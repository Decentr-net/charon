import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { mapTo, mergeMap, take, tap } from 'rxjs/operators';
import { createWalletFromMnemonic } from 'decentr-js';

import { AuthService } from '@auth/services';
import { LockService } from '@shared/features/lock';
import { UserService } from '@shared/services/user';
import { AppRoute } from '../../../app-route';

@Injectable()
export class ImportRestorePageService {
  constructor(
    private authService: AuthService,
    private lockService: LockService,
    private router: Router,
    private userService: UserService,
  ) {
  }

  public importUser(seedPhrase: string, password: string): Observable<void> {
    const { privateKey, publicKey, address: walletAddress } = createWalletFromMnemonic(seedPhrase);

    return this.userService.getUserPrivate(walletAddress).pipe(
      mergeMap((userPrivate) => this.authService.createUser({
        ...userPrivate,
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

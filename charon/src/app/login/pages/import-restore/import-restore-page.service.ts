import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { mapTo, mergeMap, take } from 'rxjs/operators';

import { UserService } from '../../../shared/services/user';
import { WalletService } from '../../../shared/services/wallet';
import { AuthService } from '../../../auth/services';
import { AppRoute } from '../../../app-route';

@Injectable()
export class ImportRestorePageService {
  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {
  }

  public importUser(seedPhrase: string, password: string): Observable<void> {
    const { privateKey, publicKey, walletAddress } = WalletService.getNewWallet(seedPhrase);

    return this.userService.getUserPrivate(walletAddress).pipe(
      mergeMap((userPrivate) => this.authService.createUser({
        ...userPrivate,
        password,
        privateKey,
        publicKey,
        walletAddress,
        emailConfirmed: false,
      })),
      mergeMap((id) => this.authService.changeUser(id)),
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

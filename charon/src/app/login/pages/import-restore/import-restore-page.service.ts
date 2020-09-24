import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { mapTo, mergeMap, take } from 'rxjs/operators';

import { UserApiService } from '../../../shared/services/user-api';
import { WalletService } from '../../../shared/services/wallet';
import { AuthService } from '../../../auth/services';
import { CryptoService } from '../../../shared/services/crypto';
import { AppRoute } from '../../../app-route';

@Injectable()
export class ImportRestorePageService {
  constructor(
    private authService: AuthService,
    private router: Router,
    private userApiService: UserApiService
  ) {
  }

  public importUser(seedPhrase: string, password: string): Observable<void> {
    const { privateKey } = WalletService.getNewWallet(seedPhrase);

    return this.userApiService.getUserData().pipe(
      mergeMap((userData) => this.authService.createUser({
        ...userData,
        privateKey,
        emailConfirmed: false,
        passwordHash: CryptoService.encryptPassword(password),
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

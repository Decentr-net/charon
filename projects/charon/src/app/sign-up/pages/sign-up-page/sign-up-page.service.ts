import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { StatusCodes } from 'http-status-codes';
import { createWalletFromMnemonic } from 'decentr-js';

import { AuthService, AuthUserCreate } from '@core/auth';
import { TranslatedError } from '@core/notifications';
import { UserService } from '@core/services';
import { SignUpStoreService } from '../../services';

@Injectable()
export class SignUpPageService {
  constructor(
    private authService: AuthService,
    private signUpStoreService: SignUpStoreService,
    private translocoService: TranslocoService,
    private userService: UserService,
  ) {
  }

  public signUp(seedPhrase: string, user: AuthUserCreate): Observable<void> {
    const wallet = createWalletFromMnemonic(seedPhrase);

    return this.userService.createUser(user.primaryEmail, wallet.address).pipe(
      catchError((error) => {
        let errorToThrow: Error;

        switch (error.status) {
          case StatusCodes.CONFLICT: {
            errorToThrow = new TranslatedError(
              this.translocoService.translate('sign_up_page.errors.account_conflict', null, 'sign-up')
            );
            break;
          }
          case StatusCodes.TOO_MANY_REQUESTS: {
            errorToThrow = new TranslatedError(
              this.translocoService.translate('sign_up_page.errors.too_many_requests', null, 'sign-up')
            );
            break;
          }
          default: {
            errorToThrow = error;
          }
        }

        return throwError(errorToThrow);
      }),
      mergeMap(() => this.signUpStoreService.setLastEmailSendingTime()),
      mergeMap(() => this.userService.getModeratorAddress()),
      mergeMap((isModerator) => this.authService.createUser({
        wallet,
        ...user,
        emailConfirmed: false,
        isModerator: isModerator === wallet.address || undefined,
        registrationCompleted: false,
      })),
      mergeMap(id => this.authService.changeUser(id)),
    );
  }
}

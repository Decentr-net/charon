import { Injectable } from '@angular/core';
import { HttpStatusCode } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
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

  public signUp(seedPhrase: string, user: Pick<AuthUserCreate, 'primaryEmail' | 'password'>): Observable<void> {
    const wallet = createWalletFromMnemonic(seedPhrase);

    return this.userService.createUser(user.primaryEmail, wallet.address).pipe(
      catchError((error) => {
        let errorToThrow: Error;

        switch (error.status) {
          case HttpStatusCode.BadRequest:
            errorToThrow = new TranslatedError(
              this.translocoService.translate('sign_up_page.errors.invalid_email', null, 'sign-up')
            );
            break;
          case HttpStatusCode.Conflict: {
            errorToThrow = new TranslatedError(
              this.translocoService.translate('sign_up_page.errors.account_conflict', null, 'sign-up')
            );
            break;
          }
          case HttpStatusCode.TooManyRequests: {
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
      mergeMap(() => this.authService.createUser({
        wallet,
        ...user,
        seed: seedPhrase,
      })),
      mergeMap(id => this.authService.changeUser(id)),
    );
  }
}

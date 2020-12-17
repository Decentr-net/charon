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
        const errorToThrow = error.status === StatusCodes.CONFLICT
          ? new TranslatedError(
            this.translocoService.translate('sign_up_page.errors.account_conflict', null, 'sign-up')
          )
          : error;

        return throwError(errorToThrow);
      }),
      mergeMap(() => this.signUpStoreService.setLastEmailSendingTime()),
      mergeMap(() => this.authService.createUser({
        wallet,
        ...user,
        emailConfirmed: false,
        registrationCompleted: false,
      })),
      mergeMap(id => this.authService.changeUser(id)),
    );
  }
}

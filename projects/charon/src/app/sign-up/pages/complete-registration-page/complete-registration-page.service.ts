import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { StatusCodes } from 'http-status-codes';
import { ProfileUpdate } from 'decentr-js';

import { AuthService } from '@core/auth';
import { UserService } from '@core/services';
import { TranslatedError } from '@core/notifications';

@Injectable()
export class CompleteRegistrationPageService {
  constructor(
    private authService: AuthService,
    private translocoService: TranslocoService,
    private userService: UserService,
  ) {
  }

  public updateUser(update: ProfileUpdate): Observable<void> {
    const user = this.authService.getActiveUserInstant();

    return this.userService.setProfile(
      update,
      user.wallet,
    ).pipe(
      delay(100),
      catchError((error) => {
        switch (error?.response?.status) {
          case StatusCodes.TOO_MANY_REQUESTS:
            return throwError(new TranslatedError(
              this.translocoService.translate(
                `sign_up.complete_registration.toastr.errors.${StatusCodes.TOO_MANY_REQUESTS}`,
                null,
              ),
            ));
          default:
            return throwError(error);
        }
      }),
    );
  }
}

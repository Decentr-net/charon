import { Injectable } from '@angular/core';
import { HttpStatusCode } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';

import { ProfileUpdate } from 'decentr-js';

import { UserService } from '@core/services';
import { TranslatedError } from '@core/notifications';

@Injectable()
export class CompleteRegistrationPageService {
  constructor(
    private translocoService: TranslocoService,
    private userService: UserService,
  ) {
  }

  public updateUser(update: ProfileUpdate): Observable<void> {
    return this.userService.setProfile(update).pipe(
      delay(100),
      catchError((error) => {
        switch (error?.response?.status) {
          case HttpStatusCode.TooManyRequests:
            return throwError(new TranslatedError(
              this.translocoService.translate(
                `sign_up.complete_registration.toastr.errors.${HttpStatusCode.TooManyRequests}`,
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

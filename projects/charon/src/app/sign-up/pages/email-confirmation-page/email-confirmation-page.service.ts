import { Injectable } from '@angular/core';
import { HttpStatusCode } from '@angular/common/http';
import { forkJoin, from, Observable, throwError } from 'rxjs';
import { catchError, map, mergeMap, startWith, tap } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';

import { AnalyticsEvent, AnalyticsService } from '@shared/analytics';
import { createSecondsTimer } from '@shared/utils/timer';
import { AuthService } from '@core/auth';
import { TranslatedError } from '@core/notifications';
import { UserService } from '@core/services';
import { SignUpStoreService } from '../../services';

const RESEND_DELAY_SEC = 60;

@Injectable()
export class EmailConfirmationPageService {
  constructor(
    private analyticsService: AnalyticsService,
    private authService: AuthService,
    private signUpStoreService: SignUpStoreService,
    private translocoService: TranslocoService,
    private userService: UserService,
  ) {
  }

  public confirmEmail(code: string): Observable<void> {
    const user = this.authService.getActiveUserInstant();

    return this.userService.confirmUser(code, user.primaryEmail).pipe(
      catchError((error) => {
        switch (error?.response?.status) {
          case HttpStatusCode.Conflict:
            return throwError(() => new TranslatedError(
              this.translocoService.translate(
                'email_confirmation_page.errors.account_conflict',
                null,
                'sign-up',
              )
            ));
          case HttpStatusCode.NotFound:
            return throwError(() => new TranslatedError(
              this.translocoService.translate(
                'email_confirmation_page.errors.account_not_found',
                null,
                'sign-up',
              )
            ));
          default:
            return throwError(() => error);
        }
      }),
      mergeMap(() => this.userService.createTestnetAccount(user.wallet.address)),
      mergeMap(() => this.userService.waitAccount(user.wallet.address)),
      map(() => void 0),
      tap(() => this.analyticsService.sendEvent(AnalyticsEvent.ConfirmRegistration)),
    );
  }

  // Call this method before leaving email confirmation page to clear related stuff
  public dispose(): Promise<void> {
    return this.signUpStoreService.clear();
  }

  public getEmailTimer(resetSource: Observable<void>): Observable<number> {
    return from(this.signUpStoreService.getLastEmailSendingTime()).pipe(
      mergeMap((lastSendingTime) => this.signUpStoreService.onLastEmailSendingTimeChange().pipe(
        startWith(lastSendingTime),
      )),
      map((lastSendingTime) => (Date.now() - (lastSendingTime || RESEND_DELAY_SEC * 1000)) / 1000),
      map(Math.floor),
      mergeMap((sentSecondsLast) => createSecondsTimer(
        RESEND_DELAY_SEC,
        Math.max(Math.ceil(RESEND_DELAY_SEC - sentSecondsLast), 0),
        resetSource,
      )),
    );
  }

  public resetSignUp(): Observable<void> {
    const { id } = this.authService.getActiveUserInstant();

    return forkJoin([
      this.authService.removeUser(id),
      this.dispose(),
    ])
      .pipe(
        map(() => void 0),
      );
  }

  public sendEmail(): Observable<void> {
    const { primaryEmail, wallet: { address: walletAddress } } = this.authService.getActiveUserInstant();

    return this.userService.createUser(primaryEmail, walletAddress)
      .pipe(
        catchError((error) => {
          const errorToThrow = (error.status === HttpStatusCode.Conflict)
            ? new TranslatedError(this.translocoService.translate(
              'email_confirmation_page.errors.account_conflict',
              null,
              'sign-up'
            ))
            : error;

          return throwError(() => errorToThrow);
        }),
        mergeMap(() => this.signUpStoreService.setLastEmailSendingTime()),
        tap(() => this.analyticsService.sendEvent(AnalyticsEvent.SendEmailCode)),
      );
  }
}

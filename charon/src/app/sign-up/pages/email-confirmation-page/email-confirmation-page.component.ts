import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, from, Observable, Subject, throwError, timer } from 'rxjs';
import { catchError, filter, finalize, map, mapTo, mergeMap, startWith, switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AuthService } from '@auth/services';
import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { AppRoute } from '../../../app-route';
import { SignUpStoreService } from '../../services';
import { UserService } from '@shared/services/user';
import { SignUpRoute } from '../../sign-up-route';
import { StatusCodes } from 'http-status-codes';
import { ToastrService } from 'ngx-toastr';
import { TranslocoService } from '@ngneat/transloco';
import { SpinnerService } from '@shared/services/spinner/spinner.service';

interface CodeForm {
  code: string;
}

const RESEND_DELAY_SEC = 60;

@UntilDestroy()
@Component({
  selector: 'app-email-confirmation-page',
  templateUrl: './email-confirmation-page.component.html',
  styleUrls: ['./email-confirmation-page.component.scss'],
  providers: [
    {
      provide: FORM_ERROR_TRANSLOCO_READ,
      useValue: 'sign_up.email_confirmation_page.form',
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailConfirmationPageComponent implements OnInit {
  @HostBinding('class.container') public readonly useContainerClass: boolean = true;

  public email: string;
  public codeForm: FormGroup<CodeForm>;
  public secondsLeftToResend: number;

  private timerReset$: Subject<void> = new Subject<void>();

  constructor(
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private router: Router,
    private signUpStoreService: SignUpStoreService,
    private spinnerService: SpinnerService,
    private toastrService: ToastrService,
    private translocoService: TranslocoService,
    private userService: UserService,
  ) {
  }

  public ngOnInit() {
    this.codeForm = this.createForm();

    this.email = this.authService.getActiveUserInstant().mainEmail;

    from(this.signUpStoreService.getLastEmailSendingTime()).pipe(
      mergeMap((lastSendingTime) => this.signUpStoreService.onLastEmailSendingTimeChange().pipe(
        startWith(lastSendingTime),
      )),
      map((lastSendingTime) => (Date.now() - (lastSendingTime || RESEND_DELAY_SEC * 1000)) / 1000),
      map(Math.floor),
      mergeMap((sentSecondsLast) => this.createTimer(
        this.timerReset$,
        RESEND_DELAY_SEC,
        Math.max(Math.ceil(RESEND_DELAY_SEC - sentSecondsLast), 0),
      )),
      untilDestroyed(this),
    ).subscribe((timerValue) => {
      this.secondsLeftToResend = timerValue;
      this.changeDetectorRef.markForCheck();
    });
  }

  public confirm(): void {
    this.spinnerService.showSpinner();

    const code = this.codeForm.getRawValue().code;
    const user = this.authService.getActiveUserInstant();

    this.userService.confirmUser(code, user.mainEmail).pipe(
      mergeMap(() => this.authService.confirmUserEmail(user.id)),
      catchError(error => {
        const message = (error.status === StatusCodes.CONFLICT)
          ? this.translocoService.translate('email_confirmation_page.toastr.errors.conflict', null, 'sign-up')
          : (error.status === StatusCodes.NOT_FOUND)
            ? this.translocoService.translate('email_confirmation_page.toastr.errors.not_found', null, 'sign-up')
            : this.translocoService.translate('toastr.errors.unknown_error');

        this.toastrService.error(message);
        return throwError(error);
      }),
      mergeMap(() => this.userService.waitAccount(user.walletAddress)),
      mergeMap(() => this.userService.setUserPrivate(
        {
          emails: [user.mainEmail]
        },
        user.walletAddress,
        user.privateKey,
      )),
      finalize(() => this.spinnerService.hideSpinner()),
      untilDestroyed(this),
    ).subscribe(() => {
      this.signUpStoreService.clear();
      this.router.navigate([AppRoute.SignUp, SignUpRoute.CompleteRegistration]);
    })
  }

  public sendEmail(): void {
    this.spinnerService.showSpinner();

    const { mainEmail, walletAddress } = this.authService.getActiveUserInstant();
    this.userService.createUser(mainEmail, walletAddress).pipe(
      mergeMap(() => this.signUpStoreService.setLastEmailSendingTime()),
      catchError(err => {
        const message = (err.status === StatusCodes.CONFLICT)
          ? this.translocoService.translate('email_confirmation_page.toastr.errors.conflict', null, 'sign-up')
          : this.translocoService.translate('toastr.errors.unknown_error');

        this.toastrService.error(message);
        return throwError(err);
      }),
      finalize(() => this.spinnerService.hideSpinner()),
    ).subscribe(() => this.resetTimer());
  }

  public registerNewAccount(): void {
    const { id } = this.authService.getActiveUserInstant();

    forkJoin([
      this.authService.removeUser(id),
      this.signUpStoreService.clear(),
    ]).pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      this.router.navigate([AppRoute.SignUp]);
    })
  }

  private createForm(): FormGroup<CodeForm> {
    return this.formBuilder.group({
      code: ['', Validators.required],
    });
  }

  private createTimer(
    resetSource: Observable<void>,
    seconds: number,
    initialSeconds: number = seconds,
  ): Observable<number> {
    const period = 1000;
    return resetSource.pipe(
      mapTo(seconds),
      startWith(initialSeconds),
      switchMap((seconds) => timer(0, period).pipe(
        map((tick) => seconds - tick),
      )),
      filter((value) => value >= 0),
    );
  }

  private resetTimer(): void {
    this.timerReset$.next();
  }
}

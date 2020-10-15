import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, Observable, Subject, timer } from 'rxjs';
import { filter, map, mapTo, mergeMap, share, startWith, switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AuthService } from '@auth/services';
import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { AppRoute } from '../../../app-route';
import { SignUpStoreService } from '../../services';
import { UserService } from '@shared/services/user';
import { SignUpRoute } from '../../sign-up-route';

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
  public resendTimer$: Observable<number>;

  private timerReset$: Subject<void> = new Subject<void>();

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private signUpStoreService: SignUpStoreService,
    private userService: UserService,
  ) {
  }

  public ngOnInit() {
    this.codeForm = this.createForm();

    this.email = this.authService.getActiveUserInstant().mainEmail;

    this.signUpStoreService.getLastEmailSendingTime().then((lastSendingTime) => {
      const sentSecondsLast = (Date.now() - (lastSendingTime || RESEND_DELAY_SEC)) / 1000;
      this.resendTimer$ = this.createTimer(
        this.timerReset$,
        RESEND_DELAY_SEC,
        Math.max(Math.ceil(RESEND_DELAY_SEC - sentSecondsLast), 0),
      ).pipe(
        share()
      );
    });
  }

  public confirm(): void {
    const code = this.codeForm.getRawValue().code;
    const user = this.authService.getActiveUserInstant();

    this.userService.confirmUser(code, user.mainEmail).pipe(
      mergeMap(() => this.authService.confirmUserEmail(user.id)),
      mergeMap(() => this.userService.setUserPublic(
        {
          gender: user.gender,
          birthday: user.birthday,
        },
        user.walletAddress,
        user.privateKey,
      )),
      mergeMap(() => this.userService.setUserPrivate(
        {
          emails: user.emails,
          usernames: user.usernames,
        },
        user.walletAddress,
        user.privateKey,
      )),
      untilDestroyed(this),
    ).subscribe(() => {
      this.signUpStoreService.clear();
      this.router.navigate([AppRoute.SignUp, SignUpRoute.Success]);
    })
  }

  public sendEmail(): void {
    const { mainEmail, walletAddress } = this.authService.getActiveUserInstant();
    this.userService.createUser(mainEmail, walletAddress).pipe(
      mergeMap(() => this.signUpStoreService.setLastEmailSendingTime()),
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

import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, timer } from 'rxjs';
import { filter, map, mapTo, startWith, switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AuthService } from '@auth/services';
import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { AppRoute } from '../../../app-route';
import { SignUpService } from '../../services';
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
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private signUpService: SignUpService,
  ) {
  }

  public ngOnInit() {
    this.codeForm = this.createForm();

    this.email = this.authService.getActiveUserInstant().mainEmail;

    this.signUpService.getLastEmailSendingTime().then((lastSendingTime) => {
      const sentSecondsLast = (Date.now() - (lastSendingTime || RESEND_DELAY_SEC)) / 1000;
      this.resendTimer$ = this.createTimer(
        this.timerReset$,
        RESEND_DELAY_SEC,
        Math.max(Math.ceil(RESEND_DELAY_SEC - sentSecondsLast), 1),
      );
    });
  }

  public confirm(): void {
    const code = this.codeForm.getRawValue().code;
    this.signUpService.confirmEmail(code).pipe(
      switchMap(() => this.signUpService.updateRemoteUser()),
      untilDestroyed(this),
    ).subscribe(() => {
      this.signUpService.endSignUp();
      this.router.navigate(['/', AppRoute.User]);
    });
  }

  public sendEmail(): void {
    this.signUpService.sendEmail().subscribe(() => {
      this.resetTimer();
    });
  }

  public registerNewAccount(): void {
    this.signUpService.resetSignUp().then(() => {
      this.router.navigate(['../', SignUpRoute.AccountForm], {
        relativeTo: this.activatedRoute,
      });
    });
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
      switchMap((seconds) => timer(1, period).pipe(
        map((tick) => seconds - tick),
      )),
      filter((value) => value >= 1),
    );
  }

  private resetTimer(): void {
    this.timerReset$.next();
  }
}

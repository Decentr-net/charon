import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, timer } from 'rxjs';
import { filter, map, mapTo, startWith, switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AuthService } from '@auth/services';
import { SignUpService } from '../../services';
import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { LocalStoreSection, LocalStoreService } from '@shared/services/local-store';
import { AppRoute } from '../../../app-route';
import { SignUpRoute } from '../../sign-up-route';

interface CodeForm {
  code: string;
}

interface EmailConfirmationStore {
  lastSentTime: number;
}

const RESEND_DELAY_SEC = 5;

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

  public email$: Observable<string>;
  public codeForm: FormGroup<CodeForm>;
  public resendTimer$: Observable<number>;

  private emailConfirmationStore: LocalStoreSection<EmailConfirmationStore>;
  private timerReset$: Subject<void> = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private signUpService: SignUpService,
    localStore: LocalStoreService,
  ) {
    this.emailConfirmationStore = localStore.useSection('signUp');
  }

  public ngOnInit() {
    this.codeForm = this.createForm();

    this.email$ = this.authService.getActiveUser().pipe(
      map(user => user.emails[0]),
    );

    this.emailConfirmationStore.get('lastSentTime').then((lastSentTime) => {
      const sentSecondsLast = (Date.now() - (lastSentTime || RESEND_DELAY_SEC)) / 1000;
      this.resendTimer$ = this.createTimer(
        this.timerReset$,
        RESEND_DELAY_SEC,
        Math.max(Math.ceil(RESEND_DELAY_SEC - sentSecondsLast), 0),
      );
      this.resendTimer$.subscribe(console.log);
    });
  }

  public confirm(): void {
    const code = this.codeForm.getRawValue().code;
    this.signUpService.confirmEmail(code).pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      this.router.navigate(['/', AppRoute.User], {
        relativeTo: this.activatedRoute,
      });
    });
  }

  public sendEmail(): void {
    this.signUpService.sendEmail().subscribe(() => {
      this.emailConfirmationStore.set('lastSentTime', Date.now());
      this.resetTimer();
    });
  }

  public registerNewAccount(): void {
    this.signUpService.reset();
    this.router.navigate(['../', SignUpRoute.AccountForm], {
      relativeTo: this.activatedRoute,
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

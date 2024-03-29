import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ControlsOf, FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AnalyticsEvent } from '@shared/analytics';
import { NotificationService } from '@shared/services/notification';
import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { AuthService } from '@core/auth';
import { SpinnerService } from '@core/services';
import { AppRoute } from '../../../app-route';
import { SignUpRoute } from '../../sign-up-route';
import { EmailConfirmationPageService } from './email-confirmation-page.service';
import { svgEmailConfirmationWait } from '@shared/svg-icons/email-confirmation-wait';

interface CodeForm {
  code: string;
}

@UntilDestroy()
@Component({
  selector: 'app-email-confirmation-page',
  templateUrl: './email-confirmation-page.component.html',
  styleUrls: ['./email-confirmation-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    EmailConfirmationPageService,
    {
      provide: FORM_ERROR_TRANSLOCO_READ,
      useValue: 'sign_up.email_confirmation_page.form',
    },
  ],
})
export class EmailConfirmationPageComponent implements OnInit {
  @HostBinding('class.container') public readonly useContainerClass: boolean = true;

  public email: string;

  public codeForm: FormGroup<ControlsOf<CodeForm>>;

  public secondsLeftToResend: number;

  public analyticsEvent: typeof AnalyticsEvent = AnalyticsEvent;

  private timerReset$: Subject<void> = new Subject<void>();

  constructor(
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private emailConfirmationPageService: EmailConfirmationPageService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private router: Router,
    private spinnerService: SpinnerService,
    private svgIconRegistry: SvgIconRegistry,
  ) {
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgEmailConfirmationWait,
    ]);

    this.codeForm = this.createForm();

    this.email = this.authService.getActiveUserInstant().primaryEmail;

    this.emailConfirmationPageService.getEmailTimer(this.timerReset$)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe((timerValue) => {
        this.secondsLeftToResend = timerValue;
        this.changeDetectorRef.markForCheck();
      });
  }

  public confirm(): void {
    const { code } = this.codeForm.getRawValue();

    this.spinnerService.showSpinner();

    this.emailConfirmationPageService.confirmEmail(code)
      .pipe(
        finalize(() => this.spinnerService.hideSpinner()),
        untilDestroyed(this),
      )
      .subscribe({
        next: () => {
          this.emailConfirmationPageService.dispose();
          this.router.navigate([AppRoute.SignUp, SignUpRoute.CompleteRegistration]);
        },
        error: (error) => this.notificationService.error(error),
      });
  }

  public sendEmail(): void {
    this.spinnerService.showSpinner();

    this.emailConfirmationPageService.sendEmail()
      .pipe(
        finalize(() => this.spinnerService.hideSpinner()),
        untilDestroyed(this),
      )
      .subscribe({
        next: () => this.resetTimer(),
        error: (error) => this.notificationService.error(error),
      });
  }

  public registerNewAccount(): void {
    this.emailConfirmationPageService.resetSignUp()
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(() => {
        this.router.navigate(['/', AppRoute.SignUp]);
      });
  }

  private createForm(): FormGroup<ControlsOf<CodeForm>> {
    return this.formBuilder.group({
      code: [
        '',
        Validators.required,
      ],
    });
  }

  private resetTimer(): void {
    this.timerReset$.next();
  }
}

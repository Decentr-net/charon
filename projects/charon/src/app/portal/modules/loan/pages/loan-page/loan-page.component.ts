import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ControlsOf, FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthService } from '@core/auth';
import { SpinnerService, UserService } from '@core/services';
import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { NotificationService } from '@shared/services/notification';
import { switchMap } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoanPersonalInfoForm } from '../../components/request-loan-form/request-loan-form.definitions';
import { LoanPageService } from './loan-page.service';

interface RequestLoanForm {
  requestLoan: LoanPersonalInfoForm;
}

@UntilDestroy()
@Component({
  selector: 'app-loan-page',
  templateUrl: './loan-page.component.html',
  styleUrls: ['./loan-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    LoanPageService,
    {
      provide: FORM_ERROR_TRANSLOCO_READ,
      useValue: 'core.profile_form',
    },
  ],
})
export class LoanPageComponent implements OnInit {

  public form: FormGroup<ControlsOf<RequestLoanForm>>;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private loanPageService: LoanPageService,
    private notificationService: NotificationService,
    private spinnerService: SpinnerService,
    private translocoService: TranslocoService,
    private userService: UserService,
  ) {
  }

  public ngOnInit(): void {
    const wallet = this.authService.getActiveUserInstant().wallet;
    this.form = this.createForm();

    this.loanPageService.getPdvRate().pipe(
      untilDestroyed(this),
      switchMap(balance => {
        this.form.get('requestLoan').patchValue({ pdvRate: +balance });
        return this.userService.getProfile(wallet.address, wallet.privateKey);
      }),
    ).subscribe(profile => {
      this.form.get('requestLoan').patchValue({
        firstName: profile.firstName,
        lastName: profile.lastName,
        walletAddress: wallet.address,
      });
    });
  }

  public onSubmit() {
    this.spinnerService.showSpinner();
    const requestLoanBody = this.form.value.requestLoan;
    this.loanPageService.requestLoan(requestLoanBody).pipe(
      finalize(() => this.spinnerService.hideSpinner()),
      untilDestroyed(this),
    ).subscribe({
      next: () => {
        this.notificationService.success(
          this.translocoService.translate('request_loan_form.notifications.success', null, 'loan'),
        );
      },
      error: (error) => {
        this.notificationService.error(error);
      },
    });
  }

  private createForm(): FormGroup<ControlsOf<RequestLoanForm>> {
    return this.formBuilder.group({
      requestLoan: undefined,
    });
  }
}

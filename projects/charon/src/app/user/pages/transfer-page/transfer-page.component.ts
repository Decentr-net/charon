import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Wallet } from 'decentr-js';

import { AuthService } from '@core/auth/services';
import { AppRoute } from '../../../app-route';
import { DASH, SPACE } from '@angular/cdk/keycodes';
import { finalize } from 'rxjs/operators';
import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { NotificationService } from '@shared/services/notification';
import { svgCheck, svgClose, svgLogoIcon } from '@shared/svg-icons';
import { TransferPageService } from './transfer-page.service';
import { NavigationService } from '@core/navigation';
import { SpinnerService } from '@core/services/spinner';
import { TranslocoService } from '@ngneat/transloco';
import { UserRoute } from '../../user.route';

interface TransferForm {
  amount: number;
  receiver: Wallet['address'];
}

@UntilDestroy()
@Component({
  selector: 'app-transfer-page',
  templateUrl: './transfer-page.component.html',
  styleUrls: ['./transfer-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TransferPageService,
    {
      provide: FORM_ERROR_TRANSLOCO_READ,
      useValue: 'user.transfer_page.form',
    },
  ],
})
export class TransferPageComponent implements OnInit {
  public appRoute: typeof AppRoute = AppRoute;
  public userRoute: typeof UserRoute = UserRoute;

  public form: FormGroup<TransferForm>;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private navigationService: NavigationService,
    private notificationService: NotificationService,
    private transferPageService: TransferPageService,
    private spinnerService: SpinnerService,
    private svgIconRegistry: SvgIconRegistry,
    private translocoService: TranslocoService,
  ) {
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgCheck,
      svgClose,
      svgLogoIcon,
    ]);

    this.form = this.createForm();
  }

  public get canSubmit(): boolean {
    return this.form && this.form.valid;
  }

  public clearReceiver(): void {
    this.form.get('receiver').reset();
  }

  private createForm(): FormGroup<TransferForm> {
    return this.formBuilder.group<TransferForm>({
      amount: [
        0.000001,
        [
          Validators.required,
          Validators.pattern('^((0)|(([1-9])([0-9]+)?)(0+)?)\\.?\\d{0,6}$'),
          Validators.min(0.000001),
        ],
        [
          this.transferPageService.createAsyncAmountValidator(),
        ],
      ],
      receiver: [
        '',
        [
          Validators.required,
        ],
        [
          this.transferPageService.createAsyncValidWalletAddressValidator(),
        ],
      ],
    })
  }

  private getWallet(): Wallet {
    return this.authService.getActiveUserInstant().wallet;
  }

  public onAmountKeyDown(event): void {
    if (event.keyCode === SPACE || event.keyCode === DASH) {
      event.preventDefault();
    }
  }

  public onSubmit(): void {
    if (!this.form.valid) {
      return;
    }

    this.spinnerService.showSpinner();

    const formValue = this.form.getRawValue();

    this.transferPageService.sendCoin({
        amount: String(formValue.amount * 1000000),
        from_address: this.getWallet().address,
        to_address: formValue.receiver,
      },
      this.getWallet().privateKey,
    ).pipe(
      finalize(() => this.spinnerService.hideSpinner()),
      untilDestroyed(this),
    ).subscribe(() => {
      this.notificationService.success(
        this.translocoService.translate('transfer_page.toastr.successful_sent', null, 'user'),
      );

      this.navigationService.back(['/', AppRoute.User])
    }, (error) => {
      this.notificationService.error(error);
    });
  }

  get receiverControl(): AbstractControl {
    return this.form.get('receiver');
  }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { MICRO_PDV_DIVISOR } from '@shared/pipes/micro-value';
import { svgArrowLeft, svgDecentrHub } from '@shared/svg-icons';
import { RECEIVER_WALLET_PARAM, TRANSFER_START_AMOUNT, TransferForm } from './transfer-page.definitions';
import { TransferPageService } from './transfer-page.service';

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
      useValue: 'portal.transfer_page.form',
    },
  ],
})
export class TransferPageComponent implements OnInit {
  @HostBinding('class.is-disabled')
  public isPageDisabled: boolean = false;

  public balance$: Observable<number>;

  public form: FormGroup<TransferForm>;

  public canSend$: Observable<boolean>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private svgIconRegistry: SvgIconRegistry,
    private transferPageService: TransferPageService,
  ) {
    svgIconRegistry.register([
      svgArrowLeft,
      svgDecentrHub,
    ]);
  }

  public ngOnInit(): void {
    this.balance$ = this.transferPageService.getBalance();

    this.form = this.createForm();

    this.canSend$ = this.form.status$.pipe(
      map((status) => status === 'VALID'),
    );
  }

  public onSubmit(): void {
    this.disablePage();

    const formValue = this.form.getRawValue();

    this.transferPageService.transfer(formValue.to, formValue.amount * MICRO_PDV_DIVISOR).pipe(
      finalize(() => this.enablePage()),
      untilDestroyed(this),
    ).subscribe(() => this.form.reset({ amount: TRANSFER_START_AMOUNT }));
  }

  private createForm(): FormGroup<TransferForm> {
    return this.formBuilder.group<TransferForm>({
      amount: [
        TRANSFER_START_AMOUNT,
        [
          Validators.required,
          Validators.pattern('^((0)|(([1-9])([0-9]+)?)(0+)?)\\.?\\d{0,6}$'),
          Validators.min(0.000001),
        ],
        [
          this.transferPageService.createAsyncAmountValidator(),
        ],
      ],
      [RECEIVER_WALLET_PARAM]: [
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

  private disablePage(): void {
    this.isPageDisabled = true;
    this.form.disable();
    this.changeDetectorRef.markForCheck();
  }

  private enablePage(): void {
    this.isPageDisabled = false;
    this.form.enable();
    this.changeDetectorRef.markForCheck();
  }
}

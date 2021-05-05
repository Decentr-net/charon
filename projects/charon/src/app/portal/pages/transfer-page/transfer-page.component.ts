import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { MICRO_PDV_DIVISOR } from '@shared/pipes/micro-value';
import { svgArrowLeft, svgDecentrHub } from '@shared/svg-icons';
import { ONE_SECOND } from '@shared/utils/date';
import { RECEIVER_WALLET_PARAM, TRANSFER_START_AMOUNT, TransferForm } from './transfer-page.definitions';
import { TransferPageService } from './transfer-page.service';
import { isOpenedInTab } from '../../../../../../../shared/utils/browser';

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

  @HostBinding('class.mod-popup-view')
  public isOpenedInPopup: boolean = !isOpenedInTab();

  public balance$: Observable<number>;

  public form: FormGroup<TransferForm>;

  public canSend$: Observable<boolean>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private router: Router,
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

    const transferTime = Date.now() - ONE_SECOND * 5;

    this.transferPageService.transfer(formValue.to, formValue.amount * MICRO_PDV_DIVISOR).pipe(
      catchError(() => {
        this.enablePage();
        return EMPTY;
      }),
      untilDestroyed(this),
    ).subscribe(() => {
      this.navigateToAssets(transferTime);
    });
  }

  private createForm(): FormGroup<TransferForm> {
    return this.formBuilder.group<TransferForm>({
      amount: [
        TRANSFER_START_AMOUNT,
        [
          Validators.required,
          Validators.pattern('^((0)|(([1-9])([0-9]+)?)(0+)?)\\.?\\d{0,6}$'),
          Validators.min(TRANSFER_START_AMOUNT),
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

  private navigateToAssets(transferTime?: number): void {
    this.router.navigate(['../'], {
      relativeTo: this.activatedRoute,
      state: {
        lastTransferTime: transferTime,
      },
    });
  }
}

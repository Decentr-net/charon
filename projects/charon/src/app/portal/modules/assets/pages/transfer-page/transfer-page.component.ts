import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  OnInit,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlsOf, FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, debounceTime, map, share, switchMap } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { FormControlWarn } from '@shared/forms';
import { MICRO_PDV_DIVISOR } from '@shared/pipes/micro-value';
import { svgArrowLeft } from '@shared/svg-icons/arrow-left';
import { svgDecentrHub } from '@shared/svg-icons/decentr-hub';
import { isOpenedInTab } from '@shared/utils/browser';
import {
  RECEIVER_WALLET_PARAM,
  TRANSFER_START_AMOUNT,
  TransferForm,
} from './transfer-page.definitions';
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
  public isPageDisabled = false;

  public isOpenedInPopup = !isOpenedInTab();

  public balance$: Observable<number>;

  public fee$: Observable<number>;

  public form: FormGroup<ControlsOf<TransferForm>>;

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

    this.fee$ = this.getFeeStream(this.form);

    const amountControl = this.form.get(['data', 'amount']);
    this.form.get('data').setAsyncValidators([
      this.transferPageService.createAsyncAmountValidator(amountControl, this.fee$),
    ]);
  }

  public onSubmit(): void {
    this.disablePage();

    const formValue = this.form.getRawValue();

    this.transferPageService.transfer(
      formValue.data.to,
      this.getUDecAmount(formValue.data.amount),
      formValue.comment || '',
    ).pipe(
      catchError(() => {
        this.enablePage();
        return EMPTY;
      }),
      untilDestroyed(this),
    ).subscribe(() => {
      this.navigateToAssets();
    });
  }

  private createForm(): FormGroup<ControlsOf<TransferForm>> {
    return this.formBuilder.group({
      data: this.formBuilder.group({
        amount: [
          TRANSFER_START_AMOUNT,
          [
            Validators.required,
            Validators.min(TRANSFER_START_AMOUNT),
            Validators.pattern('^((0)|(([1-9])([0-9]+)?)(0+)?)\\.?\\d{0,6}$'),
          ],
        ],
        [RECEIVER_WALLET_PARAM]: new FormControlWarn(
          '',
          [
            Validators.required,
          ],
          [
            this.transferPageService.createAsyncValidWalletAddressValidator(),
          ],
        ),
      }),
      comment: this.formBuilder.control(
        '',
        {
          updateOn: 'blur',
        },
      ),
    });
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

  private getUDecAmount(amount: number): number {
    return Math.round(amount * MICRO_PDV_DIVISOR);
  }

  private navigateToAssets(): void {
    this.router.navigate(['../'], {
      relativeTo: this.activatedRoute,
    });
  }

  private getFeeStream(form: FormGroup<ControlsOf<TransferForm>>, defaultValue = 0): Observable<number> {
    return form.value$.pipe(
      debounceTime(300),
      switchMap((formValue) => {
        const amount = formValue.data.amount;
        const to = formValue.data.to;

        return +amount && to
          ? this.transferPageService.getTransferFee(to, this.getUDecAmount(amount)).pipe(
            catchError(() => of(defaultValue)),
          )
          : of(defaultValue);
      }),
      share(),
    );
  }
}

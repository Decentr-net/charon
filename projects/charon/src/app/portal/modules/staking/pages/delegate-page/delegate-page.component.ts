import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, EMPTY, Observable, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  filter,
  finalize,
  map,
  pluck,
  share,
  shareReplay,
  switchMap,
  take,
} from 'rxjs/operators';
import { Validator } from 'decentr-js';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { ControlsOf, FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { CurrencySymbolService } from '@shared/components/currency-symbol';
import { svgArrowLeft } from '@shared/svg-icons/arrow-left';
import { svgLock } from '@shared/svg-icons/lock';
import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { MICRO_PDV_DIVISOR } from '@shared/pipes/micro-value';
import { NotificationService } from '@shared/services/notification';
import { SpinnerService } from '@core/services';
import { StakingRoute } from '../../staking-route';
import { DelegatePageService } from './delegate-page.service';

export interface DelegateForm {
  amount: string;
  validatorAddress: Validator['operatorAddress'];
  validatorName: Validator['description']['moniker'];
}

@UntilDestroy()
@Component({
  selector: 'app-delegate-page',
  templateUrl: './delegate-page.component.html',
  styleUrls: ['./delegate-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DelegatePageService,
    {
      provide: FORM_ERROR_TRANSLOCO_READ,
      useValue: 'staking.delegate_page.form',
    },
  ],
})
export class DelegatePageComponent implements OnInit {
  @ViewChild('ngForm') public ngForm: NgForm;

  public balance$: Observable<number>;

  public form: FormGroup<ControlsOf<DelegateForm>>;

  public fee$: Observable<number>;

  public validatorCommission$: Observable<Validator['commission']['commissionRates']['rate']>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private currencySymbolService: CurrencySymbolService,
    private delegatePageService: DelegatePageService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private spinnerService: SpinnerService,
    private svgIconRegistry: SvgIconRegistry,
    private translocoService: TranslocoService,
  ) {
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgArrowLeft,
      svgLock,
    ]);

    this.form = this.createForm();

    this.balance$ = this.delegatePageService.getBalance().pipe(
      shareReplay(1),
    );

    this.fee$ = this.form.value$.pipe(
      debounceTime(300),
      switchMap((formValue) => formValue.validatorAddress
        ? this.delegatePageService.getDelegationFee(
          formValue.validatorAddress,
          Math.round(+formValue.amount * MICRO_PDV_DIVISOR),
        ).pipe(
          catchError(() => of(0)),
        )
        : of(0),
      ),
    );

    const amountControl = this.form.get('amount');
    this.form.setAsyncValidators([
      this.delegatePageService.createAsyncAmountValidator(amountControl, this.balance$, this.fee$),
    ]);

    const validatorAddress$ = this.activatedRoute.params.pipe(
      pluck(StakingRoute.ValidatorAddressParam),
    );

    const validator$ = validatorAddress$.pipe(
      switchMap((validatorAddress) => this.delegatePageService.getValidator(validatorAddress)),
      share(),
    );

    this.validatorCommission$ = validator$.pipe(
      map((validator) => validator.commission.commissionRates.rate),
    );

    validator$.pipe(
      untilDestroyed(this),
    ).subscribe((validator) => {
      this.form.get('validatorAddress').setValue(validator.operatorAddress);
      this.form.get('validatorName').setValue(validator.description.moniker);
    });
  }

  public delegateAll(): void {
    this.spinnerService.showSpinner();

    const amountControl = this.form.get('amount');

    combineLatest([
      this.balance$,
      this.form.value$.pipe(
        map(((value) => value.validatorAddress)),
      ),
    ]).pipe(
      take(1),
      switchMap(([balance, validatorAddress]) => this.delegatePageService.getDelegationFee(validatorAddress, balance).pipe(
        map((fee) => ((balance - Math.ceil(+fee)) / MICRO_PDV_DIVISOR).toString()),
      )),
      filter((allTokens) => amountControl.value.toString() !== allTokens),
      finalize(() => this.spinnerService.hideSpinner()),
      untilDestroyed(this),
    ).subscribe((allTokens) => amountControl.setValue(allTokens));
  }

  public onSubmit(): void {
    if (!this.form.valid) {
      this.ngForm.onSubmit(void 0);
      return;
    }

    this.spinnerService.showSpinner();

    const formValue = this.form.getRawValue();

    this.delegatePageService.delegate(
      formValue.validatorAddress,
      Math.round(+formValue.amount * MICRO_PDV_DIVISOR).toString(),
    ).pipe(
      catchError((error) => {
        this.notificationService.error(error);
        return EMPTY;
      }),
      switchMap(() => this.currencySymbolService.getSymbol()),
      take(1),
      finalize(() => this.spinnerService.hideSpinner()),
      untilDestroyed(this),
    ).subscribe((currencySymbol) => {
      this.notificationService.success(
        this.translocoService.translate(
          'staking.delegate_page.notification.success',
          {
            amount: formValue.amount,
            validator: formValue.validatorName,
            currencySymbol,
          },
        ),
      );

      this.delegatePageService.navigateBack();
    });
  }

  private createForm(): FormGroup<ControlsOf<DelegateForm>> {
    return this.formBuilder.group({
      amount: [
        this.delegatePageService.minDelegateAmount.toString(),
        [
          Validators.required,
          Validators.min(this.delegatePageService.minDelegateAmount),
          Validators.pattern('^((0)|(([1-9])([0-9]+)?)(0+)?)\\.?\\d{0,6}$'),
        ],
      ],
      validatorName: this.formBuilder.control(
        { value: '', disabled: true },
      ),
      validatorAddress: this.formBuilder.control(
        { value: '', disabled: true },
      ),
    });
  }
}

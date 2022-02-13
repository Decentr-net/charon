import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  finalize,
  map,
  pluck,
  share,
  shareReplay,
  switchMap,
  take,
} from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { ControlsOf, FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Validator } from 'decentr-js';

import { CurrencySymbolService } from '@shared/components/currency-symbol';
import { svgArrowLeft } from '@shared/svg-icons/arrow-left';
import { svgRedelegate } from '@shared/svg-icons/redelegate';
import { svgUnbonded } from '@shared/svg-icons/validator-status/unbonded';
import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { MICRO_PDV_DIVISOR } from '@shared/pipes/micro-value';
import { NotificationService } from '@shared/services/notification';
import { SpinnerService } from '@core/services';
import { StakingRoute } from '../../staking-route';
import { UndelegatePageService } from './undelegate-page.service';

interface UndelegateForm {
  amount: string;
  validatorAddress: Validator['operatorAddress'];
  validatorName: Validator['description']['moniker'];
}

@UntilDestroy()
@Component({
  selector: 'app-undelegate-page',
  templateUrl: './undelegate-page.component.html',
  styleUrls: ['./undelegate-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    UndelegatePageService,
    {
      provide: FORM_ERROR_TRANSLOCO_READ,
      useValue: 'staking.undelegate_page.form',
    }
  ],
})
export class UndelegatePageComponent implements OnInit {
  @ViewChild('ngForm') public ngForm: NgForm;

  public delegatedAmount$: Observable<number>;

  public form: FormGroup<ControlsOf<UndelegateForm>>;

  public fee$: Observable<number>;

  public validatorCommission$: Observable<Validator['commission']['commissionRates']['rate']>;

  public undelegationAvailableTime: number | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private currencySymbolService: CurrencySymbolService,
    private undelegatePageService: UndelegatePageService,
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
      svgRedelegate,
      svgUnbonded,
    ]);

    const validatorAddress$ = this.activatedRoute.params.pipe(
      pluck(StakingRoute.ValidatorAddressParam),
    );

    this.delegatedAmount$ = validatorAddress$.pipe(
      switchMap((validatorAddress) => this.undelegatePageService.getDelegatedAmount(validatorAddress)),
      shareReplay(1),
    );

    this.form = this.createForm(this.delegatedAmount$);

    validatorAddress$.pipe(
      switchMap((fromValidator) => this.undelegatePageService.getUndelegationFromAvailableTime(fromValidator)),
      untilDestroyed(this),
    ).subscribe((undelegationAvailableTime) => {
      this.undelegationAvailableTime = undelegationAvailableTime;
      this.changeDetectorRef.markForCheck();
    });

    this.fee$ = this.form.value$.pipe(
      debounceTime(300),
      switchMap((formValue) => formValue.validatorAddress
        ? this.undelegatePageService.getUndelegationFee(
            formValue.validatorAddress,
            Math.ceil(+formValue.amount * MICRO_PDV_DIVISOR).toString(),
          ).pipe(
            catchError(() => of(0)),
          )
        : of(0)
      ),
    );

    const amountControl = this.form.get('amount');
    this.form.setAsyncValidators([
      this.undelegatePageService.createAsyncBalanceValidator(amountControl, this.fee$),
    ]);

    const validator$ = validatorAddress$.pipe(
      switchMap((validatorAddress) => this.undelegatePageService.getValidator(validatorAddress)),
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

  public undelegateAll(): void {
    this.delegatedAmount$.pipe(
      take(1),
      untilDestroyed(this),
    ).subscribe((delegatedAmount) => {
      this.form.get('amount').setValue((delegatedAmount / MICRO_PDV_DIVISOR).toString());
    });
  }

  public onSubmit(): void {
    if (!this.form.valid) {
      this.ngForm.onSubmit(void 0);
      return;
    }

    this.spinnerService.showSpinner();

    const formValue = this.form.getRawValue();

    this.undelegatePageService.undelegate(
      formValue.validatorAddress,
      Math.floor(+formValue.amount * MICRO_PDV_DIVISOR).toString(),
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
          'staking.undelegate_page.notification.success',
          {
            amount: formValue.amount,
            validator: formValue.validatorName,
            currencySymbol,
          },
        ),
      );

      this.undelegatePageService.navigateBack();
    });
  }

  private createForm(
    delegatedAmount$: Observable<number>,
  ): FormGroup<ControlsOf<UndelegateForm>> {
    return this.formBuilder.group({
      amount: this.formBuilder.control(
        this.undelegatePageService.minUndelegateAmount.toString(),
        [
          Validators.required,
          Validators.min(this.undelegatePageService.minUndelegateAmount),
          Validators.pattern('^((0)|(([1-9])([0-9]+)?)(0+)?)\\.?\\d{0,6}$'),
        ],
        [
          this.undelegatePageService.createAsyncAmountValidator(delegatedAmount$),
        ],
      ),
      validatorName: this.formBuilder.control(
        { value: '', disabled: true },
      ),
      validatorAddress: this.formBuilder.control(
        '',
      ),
    });
  }
}

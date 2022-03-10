import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, EMPTY, Observable, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  finalize,
  map,
  pluck,
  shareReplay,
  startWith,
  switchMap,
  take,
} from 'rxjs/operators';
import { Validator } from 'decentr-js';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { ControlsOf, FormBuilder, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { CurrencySymbolService } from '@shared/components/currency-symbol';
import { svgArrowLeft } from '@shared/svg-icons/arrow-left';
import { svgRedelegate } from '@shared/svg-icons/redelegate';
import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { SelectOption } from '@shared/components/controls/select';
import { MICRO_PDV_DIVISOR } from '@shared/pipes/micro-value';
import { NotificationService } from '@shared/services/notification';
import { SpinnerService } from '@core/services';
import { StakingRoute } from '../../staking-route';
import { RedelegatePageService } from './redelegate-page.service';

interface RedelegateForm {
  amount: string;
  fromValidatorAddress: Validator['operatorAddress'];
  toValidator?: FormControl<Validator>;
}

@UntilDestroy()
@Component({
  selector: 'app-redelegate-page',
  templateUrl: './redelegate-page.component.html',
  styleUrls: ['./redelegate-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    RedelegatePageService,
    {
      provide: FORM_ERROR_TRANSLOCO_READ,
      useValue: 'staking.redelegate_page.form',
    }
  ],
})
export class RedelegatePageComponent implements OnInit {
  @ViewChild('ngForm') public ngForm: NgForm;

  public delegatedAmount$: Observable<number>;

  public form: FormGroup<ControlsOf<RedelegateForm>>;

  public fee$: Observable<number>;

  public fromValidatorName$: Observable<Validator['description']['moniker']>;

  public toValidatorCommission$: Observable<Validator['commission']['commissionRates']['rate']>;

  public validatorsFilteredOptions$: Observable<SelectOption<Validator>[]>;

  public redelegationFromAvailableTime: number | undefined;

  public redelegationToAvailableTime: number | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private currencySymbolService: CurrencySymbolService,
    private changeDetectorRef: ChangeDetectorRef,
    private redelegatePageService: RedelegatePageService,
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
    ]);

    const validatorAddress$ = this.activatedRoute.params.pipe(
      pluck(StakingRoute.ValidatorAddressParam),
    );

    validatorAddress$.pipe(
      switchMap((validatorAddress) => this.redelegatePageService.getRedelegationFromAvailableTime(validatorAddress)),
      untilDestroyed(this),
    ).subscribe((redelegationFromAvailableTime) => {
      this.redelegationFromAvailableTime = redelegationFromAvailableTime;
      this.changeDetectorRef.markForCheck();
    });

    this.fromValidatorName$ = validatorAddress$.pipe(
      switchMap((validatorAddress: string) => this.redelegatePageService.getValidator(validatorAddress)),
      map((validator) => validator?.description.moniker),
    );

    this.delegatedAmount$ = validatorAddress$.pipe(
      switchMap((validatorAddress) => this.redelegatePageService.getDelegatedAmount(validatorAddress)),
      shareReplay(1),
    );

    this.form = this.createForm(this.delegatedAmount$);

    combineLatest([
      this.form.value$.pipe(
        map((formValue) => formValue.toValidator?.operatorAddress),
      ),
      validatorAddress$,
    ]).pipe(
      switchMap(([toValidator, fromValidator]) => toValidator
        ? this.redelegatePageService.getRedelegationToAvailableTime(fromValidator, toValidator)
        : of(undefined)
      ),
      untilDestroyed(this),
    ).subscribe((redelegationToAvailableTime) => {
      this.redelegationToAvailableTime = redelegationToAvailableTime;
      this.changeDetectorRef.markForCheck();
    });

    this.fee$ = this.form.value$.pipe(
      debounceTime(300),
      switchMap((formValue) => formValue.fromValidatorAddress && formValue.toValidator?.operatorAddress
        ? this.redelegatePageService.getRedelegationFee(
          formValue.fromValidatorAddress,
          formValue.toValidator?.operatorAddress,
          Math.ceil(+formValue.amount * MICRO_PDV_DIVISOR).toString(),
        ).pipe(
          catchError(() => of(0)),
        )
        : of(0)
      ),
    );

    const amountControl = this.form.get('amount');
    this.form.setAsyncValidators([
      this.redelegatePageService.createAsyncBalanceValidator(amountControl, this.fee$),
    ]);

    validatorAddress$.pipe(
      untilDestroyed(this),
    ).subscribe((validatorAddress) => this.form.get('fromValidatorAddress').setValue(validatorAddress));

    const validatorsOptions$ = combineLatest([
      validatorAddress$,
      this.redelegatePageService.getValidators(),
    ]).pipe(
      map(([excludeAddress, validators]) => {
        return validators
          .filter((validator) => validator.operatorAddress !== excludeAddress)
          .map((validator) => ({
            label: validator.description.moniker,
            meta: `${parseInt(`${+validator.commission.commissionRates.rate * 100}`)}%`,
            value: validator,
          }));
      }),
    );

    const toValidatorValue$ = this.form.get('toValidator').valueChanges.pipe(
      startWith(this.form.get('toValidator').value),
    );

    this.toValidatorCommission$ = toValidatorValue$.pipe(
      map((validator) => validator?.commission?.commissionRates?.rate),
    );

    this.validatorsFilteredOptions$ = combineLatest([
      validatorsOptions$,
      toValidatorValue$,
    ]).pipe(
      map(([validatorsOptions, toValidatorPartialName]) => {
        return validatorsOptions.filter((validator) => {
          return toValidatorPartialName
            // toValidator value is string when typing
            ? validator.label.includes(toValidatorPartialName.toString())
            : validatorsOptions;
        });
      }),
    );
  }

  public displayWithFn(validator: Validator): string {
    return validator?.description.moniker;
  }

  public redelegateAll(): void {
    this.delegatedAmount$.pipe(
      take(1),
      untilDestroyed(this),
    ).subscribe((balance) => {
      this.form.get('amount').setValue((balance / MICRO_PDV_DIVISOR).toString());
    });
  }

  public onSubmit(): void {
    if (!this.form.valid) {
      this.ngForm.onSubmit(void 0);
      return;
    }

    this.spinnerService.showSpinner();

    const formValue = this.form.getRawValue();

    this.redelegatePageService.redelegate(
      formValue.fromValidatorAddress,
      formValue.toValidator?.operatorAddress,
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
          'staking.redelegate_page.notification.success',
          {
            amount: formValue.amount,
            validator: formValue.toValidator.description.moniker,
            currencySymbol,
          },
        ),
      );

      this.redelegatePageService.navigateBack();
    });
  }

  private createForm(
    delegatedAmount$: Observable<number>,
  ): FormGroup<ControlsOf<RedelegateForm>> {
    return this.formBuilder.group({
      amount: this.formBuilder.control(
        this.redelegatePageService.minRedelegateAmount.toString(),
        [
          Validators.required,
          Validators.min(this.redelegatePageService.minRedelegateAmount),
          Validators.pattern('^((0)|(([1-9])([0-9]+)?)(0+)?)\\.?\\d{0,6}$'),
        ],
        [
          this.redelegatePageService.createAsyncAmountValidator(delegatedAmount$),
        ],
      ),
      fromValidatorAddress: this.formBuilder.control(
        '',
      ),
      toValidator: this.formBuilder.control(
        null,
        [
          Validators.required,
          this.redelegatePageService.createValidatorValidator(),
        ],
      ),
    });
  }
}

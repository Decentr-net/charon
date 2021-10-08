import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  finalize,
  pluck,
  share,
  shareReplay,
  switchMap,
  take,
} from 'rxjs/operators';
import { Validator } from 'decentr-js';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { svgArrowLeft } from '@shared/svg-icons/arrow-left';
import { svgSpeedometer } from '@shared/svg-icons/speedometer';
import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { MICRO_PDV_DIVISOR } from '@shared/pipes/micro-value';
import { NotificationService } from '@shared/services/notification';
import { SpinnerService } from '@core/services';
import { StakingRoute } from '../../staking-route';
import { UndelegatePageService } from './undelegate-page.service';


interface UndelegateForm {
  amount: string;
  validatorAddress: Validator['operator_address'];
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

  public form: FormGroup<UndelegateForm>;

  public fee$: Observable<number>;

  public validatorCommission$: Observable<Validator['commission']['commission_rates']['rate']>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private undelegatePageService: UndelegatePageService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private spinnerService: SpinnerService,
    private svgIconRegistry: SvgIconRegistry,
  ) {
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgArrowLeft,
      svgSpeedometer,
    ]);

    const validatorAddress$ = this.activatedRoute.params.pipe(
      pluck(StakingRoute.ValidatorAddressParam),
    );

    this.delegatedAmount$ = validatorAddress$.pipe(
      switchMap((validatorAddress) => this.undelegatePageService.getDelegatedAmount(validatorAddress)),
      shareReplay(1),
    );

    this.form = this.createForm(this.delegatedAmount$);

    this.fee$ = this.form.value$.pipe(
      debounceTime(300),
      switchMap((formValue) => formValue.validatorAddress
        ? this.undelegatePageService.getUndelegationFee(
            formValue.validatorAddress,
            (+formValue.amount * MICRO_PDV_DIVISOR).toString(),
          ).pipe(
            catchError(() => of(0)),
          )
        : of(0)
      ),
      share(),
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
      pluck('commission', 'commission_rates', 'rate'),
    );

    validator$.pipe(
      untilDestroyed(this),
    ).subscribe((validator) => {
      this.form.get('validatorAddress').setValue(validator.operator_address);
      this.form.get('validatorName').setValue(validator.description.moniker);
    });
  }

  public undelegateAll(): void {
    this.delegatedAmount$.pipe(
      take(1),
      untilDestroyed(this),
    ).subscribe((delegatedAmount) => this.form.get('amount').setValue(delegatedAmount / MICRO_PDV_DIVISOR));
  }

  public onSubmit(): void {
    if (this.form.invalid) {
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
      finalize(() => this.spinnerService.hideSpinner()),
      untilDestroyed(this),
    ).subscribe(() => {
      this.notificationService.success('Successfully undelegated');
      this.undelegatePageService.navigateBack();
    });
  }

  private createForm(
    delegatedAmount$: Observable<number>,
  ): FormGroup<UndelegateForm> {
    return this.formBuilder.group({
      amount: [
        this.undelegatePageService.minUnelegateAmount.toString(),
        [
          Validators.required,
          Validators.min(this.undelegatePageService.minUnelegateAmount),
          Validators.pattern('^((0)|(([1-9])([0-9]+)?)(0+)?)\\.?\\d{0,6}$'),
        ],
        [
          this.undelegatePageService.createAsyncAmountValidator(delegatedAmount$),
        ],
      ],
      validatorName: [
        { value: '', disabled: true },
      ],
      validatorAddress: [
        '',
      ],
    });
  }
}

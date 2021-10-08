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
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { svgArrowLeft } from '@shared/svg-icons/arrow-left';
import { svgSpeedometer } from '@shared/svg-icons/speedometer';
import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { MICRO_PDV_DIVISOR } from '@shared/pipes/micro-value';
import { NotificationService } from '@shared/services/notification';
import { SpinnerService } from '@core/services';
import { StakingRoute } from '../../staking-route';
import { DelegatePageService } from './delegate-page.service';

export interface DelegateForm {
  amount: string;
  validatorAddress: Validator['operator_address'];
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
    }
  ],
})
export class DelegatePageComponent implements OnInit {
  @ViewChild('ngForm') public ngForm: NgForm;

  public balance$: Observable<number>;

  public form: FormGroup<DelegateForm>;

  public fee$: Observable<number>;

  public validatorCommission$: Observable<Validator['commission']['commission_rates']['rate']>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private delegatePageService: DelegatePageService,
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

    this.form = this.createForm();

    this.balance$ = this.delegatePageService.getBalance().pipe(
      shareReplay(1),
    );

    this.fee$ = this.form.value$.pipe(
      debounceTime(300),
      switchMap((formValue) => formValue.validatorAddress
        ? this.delegatePageService.getDelegationFee(
            formValue.validatorAddress,
            +formValue.amount * MICRO_PDV_DIVISOR,
          ).pipe(
            catchError(() => of(0)),
          )
        : of(0),
      ),
      share(),
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
      pluck('commission', 'commission_rates', 'rate'),
    );

    validator$.pipe(
      untilDestroyed(this),
    ).subscribe((validator) => {
      this.form.get('validatorAddress').setValue(validator.operator_address);
      this.form.get('validatorName').setValue(validator.description.moniker);
    });
  }

  public delegateAll(): void {
    this.spinnerService.showSpinner();

    const amountControl = this.form.get('amount');

    combineLatest([
      this.balance$,
      this.form.value$.pipe(
        pluck('validatorAddress'),
      ),
    ]).pipe(
      take(1),
      switchMap(([balance, validatorAddress]) => this.delegatePageService.getDelegationFee(validatorAddress, balance).pipe(
        map((fee) => (balance - Math.ceil(+fee)) / MICRO_PDV_DIVISOR),
      )),
      filter((allTokens) => amountControl.value !== allTokens),
      finalize(() => this.spinnerService.hideSpinner()),
      untilDestroyed(this),
    ).subscribe((allTokens) => amountControl.setValue(allTokens));
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.ngForm.onSubmit(void 0);
      return;
    }

    this.spinnerService.showSpinner();

    const formValue = this.form.getRawValue();

    this.delegatePageService.delegate(
      formValue.validatorAddress,
      (+formValue.amount * MICRO_PDV_DIVISOR).toString(),
    ).pipe(
      catchError((error) => {
        this.notificationService.error(error);
        return EMPTY;
      }),
      finalize(() => this.spinnerService.hideSpinner()),
      untilDestroyed(this),
    ).subscribe(() => {
      this.notificationService.success('Successfully delegated');
      this.delegatePageService.navigateBack();
    });
  }

  private createForm(): FormGroup<DelegateForm> {
    return this.formBuilder.group({
      amount: [
        this.delegatePageService.minDelegateAmount.toString(),
        [
          Validators.required,
          Validators.min(this.delegatePageService.minDelegateAmount),
          Validators.pattern('^((0)|(([1-9])([0-9]+)?)(0+)?)\\.?\\d{0,6}$'),
        ],
      ],
      validatorName: [
        { value: '', disabled: true },
      ],
      validatorAddress: [
        { value: '', disabled: true },
      ],
    });
  }
}

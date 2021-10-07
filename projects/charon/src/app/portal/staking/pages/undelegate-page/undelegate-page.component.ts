import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError, finalize, pluck, share, shareReplay, switchMap, take } from 'rxjs/operators';
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

  public validatorCommission$: Observable<Validator['commission']['commission_rates']['rate']>;
  public validatorName$: Observable<Validator['description']['moniker']>;

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

    this.form = this.createForm();

    const validatorAddress$ = this.activatedRoute.params.pipe(
      pluck(StakingRoute.ValidatorAddressParam),
    );

    this.delegatedAmount$ = validatorAddress$.pipe(
      switchMap((validatorAddress) => this.undelegatePageService.getDelegatedAmount(validatorAddress)),
      shareReplay(1),
    );

    const amountControl = this.form.get('amount');
    this.form.setAsyncValidators([
      this.undelegatePageService.createAsyncAmountValidator(amountControl, this.delegatedAmount$),
    ]);

    const validator$ = validatorAddress$.pipe(
      switchMap((validatorAddress) => this.undelegatePageService.getValidator(validatorAddress)),
      share(),
    );

    this.validatorCommission$ = validator$.pipe(
      pluck('commission', 'commission_rates', 'rate'),
    );

    this.validatorName$ = validator$.pipe(
      pluck('description', 'moniker'),
    );

    validatorAddress$.pipe(
      untilDestroyed(this),
    ).subscribe((validatorAddress) => this.form.get('validatorAddress').setValue(validatorAddress));
  }

  public undelegateAll(): void {
    this.delegatedAmount$.pipe(
      take(1),
      untilDestroyed(this),
    ).subscribe((balance) => this.form.get('amount').setValue(balance / MICRO_PDV_DIVISOR));
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

  private createForm(): FormGroup<UndelegateForm> {
    return this.formBuilder.group({
      amount: [
        '0',
        [
          Validators.required,
          Validators.min(1 / MICRO_PDV_DIVISOR),
          Validators.pattern('^((0)|(([1-9])([0-9]+)?)(0+)?)\\.?\\d{0,6}$'),
        ],
      ],
      validatorAddress: [
        { value: '', disabled: true },
      ],
    });
  }
}

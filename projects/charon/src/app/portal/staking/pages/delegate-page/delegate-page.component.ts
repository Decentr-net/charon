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

  public validatorCommission$: Observable<Validator['commission']['commission_rates']['rate']>;
  public validatorName$: Observable<Validator['description']['moniker']>;

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

    const amountControl = this.form.get('amount');
    this.form.setAsyncValidators([
      this.delegatePageService.createAsyncAmountValidator(amountControl, this.balance$),
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

    this.validatorName$ = validator$.pipe(
      pluck('description', 'moniker'),
    );

    validatorAddress$.pipe(
      untilDestroyed(this),
    ).subscribe((validatorAddress) => this.form.get('validatorAddress').setValue(validatorAddress));
  }

  public delegateAll(): void {
    this.balance$.pipe(
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
        '0',
        [
          Validators.required,
          Validators.min(1 / MICRO_PDV_DIVISOR),
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

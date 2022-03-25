import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, filter, finalize, map, pluck, startWith, switchMap, take } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, EMPTY, Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { CurrencySymbolService } from '@shared/components/currency-symbol';
import { DistributionService, SpinnerService } from '@core/services';
import { MicroValuePipe } from '@shared/pipes/micro-value';
import { NotificationService } from '@shared/services/notification';
import { ValidatorDefinitionShort } from '../../models';
import { WithdrawValidatorPageService } from './withdraw-validator-page.service';
import { exponentialToFixed } from '@shared/utils/number';
import { StakingRoute } from '../../staking-route';

@UntilDestroy()
@Component({
  selector: 'app-withdraw-validator-page',
  templateUrl: './withdraw-validator-page.component.html',
  styleUrls: ['./withdraw-validator-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    WithdrawValidatorPageService,
  ],
})
export class WithdrawValidatorPageComponent implements OnInit {
  public fee$: Observable<number>;

  public selectedItems$: BehaviorSubject<ValidatorDefinitionShort[]> = new BehaviorSubject([]);

  public selectedItemsRewards$: Observable<number>;

  public validators$: Observable<ValidatorDefinitionShort[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private currencySymbolService: CurrencySymbolService,
    private distributionService: DistributionService,
    private microValuePipe: MicroValuePipe,
    private notificationService: NotificationService,
    private router: Router,
    private spinnerService: SpinnerService,
    private translocoService: TranslocoService,
    private withdrawValidatorPageService: WithdrawValidatorPageService,
  ) {
  }

  public getSelectedItemsRewards(): Observable<number> {
    return this.selectedItems$.pipe(
      map((items) => items.reduce((sum, item) => sum + item.reward, 0))
    );
  }

  public ngOnInit(): void {
    this.selectedItemsRewards$ = this.getSelectedItemsRewards();

    this.validators$ = this.activatedRoute.params.pipe(
      pluck(StakingRoute.ValidatorAddressParam),
      switchMap((validatorAddress) => this.withdrawValidatorPageService.getValidator(validatorAddress)),
    );

    this.fee$ = this.getFee();

    combineLatest([
      this.activatedRoute.params.pipe(
        pluck(StakingRoute.ValidatorAddressParam),
      ),
      this.validators$,
    ]).pipe(
      map(([initialSelectedValidatorAddress, validators]) => {
        return validators.find(({ address }) => address === initialSelectedValidatorAddress);
      }),
      filter((selectedValidator) => !!selectedValidator),
      untilDestroyed(this)
    ).subscribe((selectedValidator) => {
      this.chooseValidator(selectedValidator);
    });
  }

  public chooseValidator(validator: ValidatorDefinitionShort): void {
    this.selectedItems$.next([validator]);
  }

  public getFee(): Observable<number> {
    return this.selectedItems$.pipe(
      filter((items) => items.length > 0),
      switchMap(() => this.distributionService.calculateWithdrawValidatorRewardsFee()),
      startWith(0),
    );
  }

  public onSubmit(): void {
    this.spinnerService.showSpinner();

    this.distributionService.withdrawValidatorRewards().pipe(
      catchError((error) => {
        this.notificationService.error(error);
        return EMPTY;
      }),
      switchMap(() => combineLatest([
        this.currencySymbolService.getSymbol(),
        this.getSelectedItemsRewards(),
      ])),
      take(1),
      finalize(() => this.spinnerService.hideSpinner()),
      untilDestroyed(this),
    ).subscribe(([currencySymbol, amount]) => {
      this.notificationService.success(
        this.translocoService.translate(
          'staking.withdraw_validator_page.notification.success',
          {
            amount: exponentialToFixed(this.microValuePipe.transform(amount)),
            currencySymbol,
          },
        ),
      );

      this.router.navigate(['../../'], {
        relativeTo: this.activatedRoute,
      });
    });
  }
}

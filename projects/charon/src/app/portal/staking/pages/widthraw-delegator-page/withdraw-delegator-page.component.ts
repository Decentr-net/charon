import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, filter, finalize, map, startWith, switchMap, take } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, EMPTY, Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { CurrencySymbolService } from '@shared/components/currency-symbol';
import { DistributionService, SpinnerService } from '@core/services';
import { MicroValuePipe } from '@shared/pipes/micro-value';
import { NotificationService } from '@shared/services/notification';
import { StakingRoute } from '../../staking-route';
import { ValidatorDefinitionShort } from '../../models';
import { WithdrawDelegatorPageService } from './withdraw-delegator-page.service';

@UntilDestroy()
@Component({
  selector: 'app-withdraw-delegator-page',
  templateUrl: './withdraw-delegator-page.component.html',
  styleUrls: ['./withdraw-delegator-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    WithdrawDelegatorPageService,
  ],
})
export class WithdrawDelegatorPageComponent implements OnInit {
  public stakingRoute: typeof StakingRoute = StakingRoute;

  public fee$: Observable<number>;

  public selectedItems$: BehaviorSubject<ValidatorDefinitionShort[]> = new BehaviorSubject([]);

  public selectedItemsRewards$: Observable<number>;

  public totalDelegatorRewards$: Observable<number>;

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
    private withdrawDelegatorPageService: WithdrawDelegatorPageService,
  ) {
  }

  public getSelectedItemsRewards(): Observable<number> {
    return this.selectedItems$.pipe(
      map((items) => items.reduce((sum, item) => sum + item.reward, 0))
    );
  }

  public ngOnInit(): void {
    this.selectedItemsRewards$ = this.getSelectedItemsRewards();

    this.totalDelegatorRewards$ = this.distributionService.getTotalDelegatorRewards();

    this.validators$ = this.withdrawDelegatorPageService.getValidators();

    this.fee$ = this.getFee();
  }

  public onItemClick(item: ValidatorDefinitionShort): void {
    this.selectedItems$.next([item]);
  }

  public chooseAll(validators: ValidatorDefinitionShort[]): void {
    this.selectedItems$.next(validators);
  }

  public getFee(): Observable<number> {
    return this.selectedItems$.pipe(
      filter((items) => items.length > 0),
      switchMap((items) => this.distributionService.calculateWithdrawDelegatorRewardsFee(this.selectedItems$.value.length > 1 ? undefined : this.selectedItems$.value[0].address)),
      startWith(0),
    );
  }

  public onSubmit(): void {
    this.spinnerService.showSpinner();

    this.distributionService.createDistribution(this.selectedItems$.value.length > 1 ? undefined : this.selectedItems$.value[0].address).pipe(
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
          'staking.withdraw_delegator_page.notification.success',
          {
            amount: this.microValuePipe.transform(amount),
            currencySymbol,
          },
        ),
      );

      this.router.navigate(['../'], {
        relativeTo: this.activatedRoute,
      });
    });
  }
}

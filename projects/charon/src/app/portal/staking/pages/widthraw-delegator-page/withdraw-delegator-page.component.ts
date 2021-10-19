import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

import { DistributionService, SpinnerService } from '@core/services';
import { StakingRoute } from '../../staking-route';
import { ValidatorDefinitionShort } from '../../models';
import { WithdrawDelegatorPageService } from './withdraw-delegator-page.service';

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

  public validators$: Observable<ValidatorDefinitionShort[]>;

  public totalDelegatorRewards$: Observable<number>;

  public selectedItems: ValidatorDefinitionShort[] = [];

  // TODO: add fee
  // public fee$: Observable<number>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private distributionService: DistributionService,
    private router: Router,
    private spinnerService: SpinnerService,
    private translocoService: TranslocoService,
    private withdrawDelegatorPageService: WithdrawDelegatorPageService,
  ) {
  }

  public get selectedItemsRewards(): number {
    return this.selectedItems.reduce((sum, item) => sum + item.reward, 0);
  }

  public ngOnInit(): void {
    this.validators$ = this.withdrawDelegatorPageService.getValidators();

    this.totalDelegatorRewards$ = this.distributionService.getTotalDelegatorRewards();
  }

  public onItemClick(item: ValidatorDefinitionShort): void {
    this.selectedItems = [item];
  }

  public chooseAll(validators: ValidatorDefinitionShort[]): void {
    this.selectedItems = validators;
  }

  public onSubmit(): void {
    this.spinnerService.showSpinner();

    this.distributionService.createDistribution(this.selectedItems.length > 1 ? undefined : this.selectedItems[0].address).pipe(
      finalize(() => {
        this.spinnerService.hideSpinner();

        this.router.navigate(['../'], {
          relativeTo: this.activatedRoute,
        });
      }),
    ).subscribe();
  }
}

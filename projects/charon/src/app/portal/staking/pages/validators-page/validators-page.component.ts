import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormControl } from '@ngneat/reactive-forms';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ValidatorStatus } from 'decentr-js';

import { svgGetCoin } from '@shared/svg-icons/get-coin';
import { DistributionService } from '@core/services/distribution';
import { ValidatorDefinition } from '../../models';
import { StakingRoute } from '../../staking-route';
import { INITIAL_VALIDATOR_ADDRESS_PARAM } from '../widthraw-delegator-page';
import { ValidatorsPageService } from './validators-page.service';

@UntilDestroy()
@Component({
  selector: 'app-validators-page',
  templateUrl: './validators-page.component.html',
  styleUrls: ['./validators-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ValidatorsPageService,
  ],
})
export class ValidatorsPageComponent implements OnInit {
  public stakingRoute: typeof StakingRoute = StakingRoute;

  public validators$: Observable<ValidatorDefinition[]>;

  public totalDelegatorRewards: number;

  public onlyBondedFormControl: FormControl<boolean> = new FormControl(false);

  constructor(
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private distributionService: DistributionService,
    private router: Router,
    private svgIconRegistry: SvgIconRegistry,
    private validatorsPageService: ValidatorsPageService,
  ) {
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgGetCoin,
    ]);

    this.validators$ = combineLatest([
      this.validatorsPageService.getValidators(),
      this.onlyBondedFormControl.value$,
    ]).pipe(
      map(([validators, onlyBonded]) => {
        return validators.filter(({ status }) => !onlyBonded || status === ValidatorStatus.Bonded);
      }),
    );

    this.distributionService.getTotalDelegatorRewards().pipe(
      untilDestroyed(this),
    ).subscribe((totalDelegatorRewards) => {
      this.totalDelegatorRewards = totalDelegatorRewards;

      this.changeDetectorRef.markForCheck();
    });
  }

  public onValidatorRewardClick(validator: ValidatorDefinition): void {
    this.router.navigate([StakingRoute.Withdraw], {
      relativeTo: this.activatedRoute,
      queryParams: { [INITIAL_VALIDATOR_ADDRESS_PARAM]: validator.address },
    });
  }
}

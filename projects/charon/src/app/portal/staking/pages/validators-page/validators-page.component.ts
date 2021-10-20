import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormControl } from '@ngneat/reactive-forms';
import { ValidatorStatus } from 'decentr-js';

import { DistributionService } from '@core/services/distribution';
import { ValidatorDefinition } from '../../models';
import { ValidatorsPageService } from './validators-page.service';
import { StakingRoute } from '../../staking-route';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { svgGetCoin } from '@shared/svg-icons/get-coin';

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
    private changeDetectorRef: ChangeDetectorRef,
    private distributionService: DistributionService,
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

    this.distributionService.getTotalDelegatorRewards().subscribe((totalDelegatorRewards) => {
      this.totalDelegatorRewards = totalDelegatorRewards;

      this.changeDetectorRef.markForCheck();
    });
  }
}

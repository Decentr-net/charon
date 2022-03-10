import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, share, switchMap } from 'rxjs/operators';
import { FormControl } from '@ngneat/reactive-forms';
import { Sort } from '@angular/material/sort';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BondStatus, Wallet } from 'decentr-js';

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
  public validatorsSort: BehaviorSubject<Sort> = new BehaviorSubject(undefined);

  public stakingRoute: typeof StakingRoute = StakingRoute;

  public validators$: Observable<ValidatorDefinition[]>;

  public totalDelegatorRewards: number;

  public onlyBondedFormControl: FormControl<boolean> = new FormControl(false);

  public userValidatorAddress$: Observable<Wallet['validatorAddress']>;

  public selfValidator$: Observable<ValidatorDefinition>;

  public totalValidatorRewards: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private distributionService: DistributionService,
    private router: Router,
    private svgIconRegistry: SvgIconRegistry,
    private validatorsPageService: ValidatorsPageService,
  ) {
  }

  public getSelfValidator(): Observable<ValidatorDefinition> {
    return this.validators$.pipe(
      map((validators) => validators.find((validator) => validator.selfValidator)),
    );
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgGetCoin,
    ]);

    this.validators$ = combineLatest([
      this.validatorsPageService.getValidators(),
      this.onlyBondedFormControl.value$,
      this.validatorsSort,
    ]).pipe(
      map(([validators, onlyBonded, sort]) => {
        return validators
          .filter(({ status }) => !onlyBonded || status === BondStatus.BOND_STATUS_BONDED)
          .sort((left, right) => {
            if (!sort || !sort.direction) {
              return 0;
            }

            const leftValue = left[sort.active] || 0;
            const rightValue = right[sort.active] || 0;

            return (typeof leftValue === 'number'
              ? leftValue - rightValue
              : leftValue.toString().localeCompare(rightValue)
            ) * (sort.direction === 'asc' ? 1 : -1);
          });
      }),
      share(),
    );

    this.validators$.pipe(
      map((validators) => validators.reduce((acc, validator) => acc + validator.reward, 0)),
      untilDestroyed(this),
    ).subscribe((totalDelegatorRewards) => {
      this.totalDelegatorRewards = totalDelegatorRewards;

      this.changeDetectorRef.markForCheck();
    });

    this.userValidatorAddress$ = this.validatorsPageService.getUserValidatorAddress();

    this.selfValidator$ = this.getSelfValidator();

    this.getTotalValidatorRewards().pipe(
      untilDestroyed(this),
    ).subscribe((totalValidatorRewards) => {
      this.totalValidatorRewards = totalValidatorRewards;

      this.changeDetectorRef.markForCheck();
    });
  }

  public getTotalValidatorRewards(): Observable<string> {
    return this.getSelfValidator().pipe(
      switchMap((validator) => validator ? this.validatorsPageService.getValidatorDistribution() : of('0')),
    );
  }

  public onValidatorRewardClick(validator: ValidatorDefinition): void {
    this.router.navigate([StakingRoute.Withdraw], {
      relativeTo: this.activatedRoute,
      queryParams: { [INITIAL_VALIDATOR_ADDRESS_PARAM]: validator.address },
    });
  }

  public sort(sort: Sort): void {
    this.validatorsSort.next(sort);
  }
}

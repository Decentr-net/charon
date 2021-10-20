import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Delegation, DelegatorRewards, Validator } from 'decentr-js';

import { DistributionService, StakingService } from '@core/services';
import { ValidatorDefinitionShort } from '../../models';
import { buildValidatorDefinitionShort } from '../../utils';

@Injectable()
export class WithdrawDelegatorPageService {
  constructor(
    private activatedRoute: ActivatedRoute,
    private distributionService: DistributionService,
    private router: Router,
    private stakingService: StakingService,
  ) {
  }

  public getValidators(): Observable<ValidatorDefinitionShort[]> {
    return combineLatest([
      this.stakingService.getValidators(),
      this.stakingService.getDelegations(),
      this.distributionService.getDelegatorRewards(),
    ]).pipe(
      map(([validators, delegations, delegatorRewards]: [
        Validator[],
        Delegation[],
        DelegatorRewards,
      ]) => {
        return validators
          .map((validator) => buildValidatorDefinitionShort(validator, delegations, delegatorRewards))
          .filter((validator) => validator.reward > 0);
      }),
    );
  }

  public navigateBack(): void {
    this.router.navigate(['../../'], {
      relativeTo: this.activatedRoute,
    });
  }
}

import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DelegationResponse, QueryDelegationTotalRewardsResponse, UnbondingDelegation, Validator } from 'decentr-js';

import { DistributionService, StakingService } from '@core/services';
import { ValidatorDefinitionShort } from '../../models';
import { buildValidatorDefinitionShort } from '../../utils';

@Injectable()
export class WithdrawDelegatorPageService {
  constructor(
    private distributionService: DistributionService,
    private stakingService: StakingService,
  ) {
  }

  public getValidators(): Observable<ValidatorDefinitionShort[]> {
    return combineLatest([
      this.stakingService.getValidators(),
      this.stakingService.getDelegations(),
      this.distributionService.getDelegatorRewards(),
      this.stakingService.getUnbondingDelegations(),
    ]).pipe(
      map(([validators, delegations, delegatorRewards,unbondingDelegations]: [
        Validator[],
        DelegationResponse[],
        QueryDelegationTotalRewardsResponse,
        UnbondingDelegation[],
      ]) => {
        return validators
          .map((validator) => buildValidatorDefinitionShort(validator, delegations, delegatorRewards, unbondingDelegations))
          .filter((validator) => validator.reward > 0);
      }),
    );
  }
}

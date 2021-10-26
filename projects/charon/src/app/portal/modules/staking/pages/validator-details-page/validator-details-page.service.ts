import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Delegation, DelegatorRewards, Pool, Validator } from 'decentr-js';

import { buildValidatorDefinition } from '../../utils';
import { DistributionService } from '@core/services/distribution';
import { StakingService } from '@core/services/staking';
import { ValidatorDefinition } from '../../models';

@Injectable()
export class ValidatorDetailsPageService {
  constructor(
    private distributionService: DistributionService,
    private stakingService: StakingService,
  ) {
  }

  public getValidator(address: Validator['operator_address']): Observable<ValidatorDefinition> {
    return combineLatest([
      this.stakingService.getValidator(address),
      this.stakingService.getPool(),
      this.stakingService.getDelegations(),
      this.distributionService.getDelegatorRewards(),
    ]).pipe(
      map(([validator, pool, delegations, delegatorRewards]: [
        Validator,
        Pool,
        Delegation[],
        DelegatorRewards
      ]) => buildValidatorDefinition(validator, pool, delegations, delegatorRewards)),
    );
  }
}

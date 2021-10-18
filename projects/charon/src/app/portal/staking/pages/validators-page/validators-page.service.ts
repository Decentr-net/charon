import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Delegation, DelegatorRewards, Pool, Validator } from 'decentr-js';

import { buildValidatorDefinition } from '../../utils';
import { AuthService } from '@core/auth/services';
import { DistributionService } from '@core/services/distribution';
import { StakingService } from '@core/services/staking';
import { ValidatorDefinition } from '../../models';

@Injectable()
export class ValidatorsPageService {
  constructor(
    private authService: AuthService,
    private distributionService: DistributionService,
    private stakingService: StakingService,
  ) {
  }

  public getValidators(): Observable<ValidatorDefinition[]> {
    return combineLatest([
      this.stakingService.getValidators(),
      this.stakingService.getPool(),
      this.stakingService.getDelegations(),
      this.distributionService.getDelegatorRewards(),
    ]).pipe(
      map(([validators, pool, delegations, delegatorRewards]: [
        Validator[],
        Pool,
        Delegation[],
        DelegatorRewards
      ]) => validators.map((validator) => buildValidatorDefinition(validator, pool, delegations, delegatorRewards))),
    );
  }
}

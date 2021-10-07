import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Delegation, Pool, Validator } from 'decentr-js';

import { StakingService } from '@core/services/staking';
import { ValidatorDefinition } from '../../models';
import { buildValidatorDefinition } from '../../utils';

@Injectable()
export class ValidatorsPageService {
  constructor(
    private stakingService: StakingService,
  ) {
  }

  public getValidators(): Observable<ValidatorDefinition[]> {
    return combineLatest([
      this.stakingService.getValidators(),
      this.stakingService.getPool(),
      this.stakingService.getDelegations(),
    ]).pipe(
      map(([validators, pool, delegations]: [Validator[], Pool, Delegation[]]) => {
        return validators.map((validator) => buildValidatorDefinition(validator, pool, delegations));
      }),
    );
  }
}

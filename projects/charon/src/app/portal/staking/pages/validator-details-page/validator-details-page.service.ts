import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Delegation, Pool, Validator } from 'decentr-js';

import { buildValidatorDefinition } from '../../utils';
import { StakingService } from '@core/services/staking';
import { ValidatorDefinition } from '../../models';

@Injectable()
export class ValidatorDetailsPageService {
  constructor(
    private stakingService: StakingService,
  ) {
  }

  public getValidator(address: Validator['operator_address']): Observable<ValidatorDefinition> {
    return forkJoin([
      this.stakingService.getValidator(address),
      this.stakingService.getPool(),
      this.stakingService.getDelegations(),
    ]).pipe(
      map(([validator, pool, delegations]: [Validator, Pool, Delegation[]]) => {
        return buildValidatorDefinition(validator, pool, delegations);
      }),
    );
  }
}

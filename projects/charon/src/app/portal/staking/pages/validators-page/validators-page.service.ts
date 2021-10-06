import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Delegation, Pool, Validator } from 'decentr-js';

import { StakingService } from '@core/services/staking';
import { ValidatorDefinition } from './validators-page.definitions';

@Injectable()
export class ValidatorsPageService {
  constructor(
    private stakingService: StakingService,
  ) {
  }

  public getValidators(): Observable<ValidatorDefinition[]> {
    return forkJoin([
      this.stakingService.getValidators(),
      this.stakingService.getPool(),
      this.stakingService.getDelegations(),
    ]).pipe(
      map(([validators, pool, delegations]: [Validator[], Pool, Delegation[]]) => {
        return validators.map((validator) => this.mapValidator(validator, pool, delegations));
      }),
    );
  }

  private mapValidator(validator: Validator, pool: Pool, delegations: Delegation[]): ValidatorDefinition {
    return {
      address: validator.operator_address,
      commission: validator.commission.commission_rates.rate,
      delegated: delegations
        .find((delegation) => delegation.validator_address === validator.operator_address)
        ?.balance.amount,
      details: validator.description.details,
      name: validator.description.moniker,
      status: validator.status,
      votingPower: +validator.tokens / pool.bonded_tokens,
      website: validator.description.website,
    };
  }
}

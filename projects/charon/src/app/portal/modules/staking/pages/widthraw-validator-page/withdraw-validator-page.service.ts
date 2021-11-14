import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Delegation, UnbondingDelegation, Validator, ValidatorDistribution } from 'decentr-js';

import { DistributionService, StakingService } from '@core/services';
import { ValidatorDefinitionShort } from '../../models';
import { buildValidatorOperatorDefinition } from '../../utils';

@Injectable()
export class WithdrawValidatorPageService {
  constructor(
    private distributionService: DistributionService,
    private stakingService: StakingService,
  ) {
  }

  public getValidator(address: Validator['operator_address']): Observable<ValidatorDefinitionShort[]> {
    return combineLatest([
      this.stakingService.getValidator(address),
      this.stakingService.getDelegations(),
      this.distributionService.getValidatorDistribution(address),
      this.stakingService.getUnbondingDelegations(),
    ]).pipe(
      map(([validator, delegations, validatorRewards, unbondingDelegations]: [
        Validator,
        Delegation[],
        ValidatorDistribution,
        UnbondingDelegation[],
      ]) => {
        return [buildValidatorOperatorDefinition(validator, delegations, validatorRewards, unbondingDelegations)];
      }),
    );
  }
}

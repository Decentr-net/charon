import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Delegation, Validator, ValidatorDistribution } from 'decentr-js';

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
    ]).pipe(
      map(([validator, delegations, validatorRewards]: [
        Validator,
        Delegation[],
        ValidatorDistribution,
      ]) => {
        return [buildValidatorOperatorDefinition(validator, delegations, validatorRewards)];
      }),
    );
  }
}

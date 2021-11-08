import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DenomAmount, Validator } from 'decentr-js';

import { DistributionService, StakingService } from '@core/services';
import { ValidatorOperatorDefinitionShort } from '../../models';
import { buildValidatorOperatorDefinition } from '../../utils';

@Injectable()
export class WithdrawValidatorPageService {
  constructor(
    private distributionService: DistributionService,
    private stakingService: StakingService,
  ) {
  }

  public getValidator(address: Validator['operator_address']): Observable<ValidatorOperatorDefinitionShort[]> {
    return combineLatest([
      this.stakingService.getValidator(address),
      this.distributionService.getValidatorRewards(address),
    ]).pipe(
      map(([validator, validatorRewards]: [
        Validator,
        DenomAmount[],
      ]) => {
        return [buildValidatorOperatorDefinition(validator, validatorRewards)];
      }),
    );
  }
}

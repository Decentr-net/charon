import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Delegation, DelegatorRewards, Pool, Validator, Wallet } from 'decentr-js';

import { AuthService } from '@core/auth';
import { buildValidatorDefinition } from '../../utils';
import { DistributionService } from '@core/services/distribution';
import { StakingService } from '@core/services/staking';
import { ValidatorDefinition } from '../../models';

@Injectable()
export class ValidatorDetailsPageService {
  constructor(
    private authService: AuthService,
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

  public getUserValidatorAddress(): Observable<Wallet['validatorAddress']> {
    return this.authService.getActiveUser().pipe(
      map((account) => account.wallet.validatorAddress),
    )
  }
}

import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  DelegationResponse,
  Pool,
  QueryDelegationTotalRewardsResponse,
  UnbondingDelegation,
  Validator,
  Wallet,
} from 'decentr-js';

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
      this.getUserValidatorAddress(),
      this.stakingService.getUnbondingDelegations(),
    ]).pipe(
      map(([
        validators,
        pool,
        delegations,
        delegatorRewards,
        selfValidator,
        unbondingDelegations,
     ]: [
        Validator[],
        Pool,
        DelegationResponse[],
        QueryDelegationTotalRewardsResponse,
        Wallet['validatorAddress'],
        UnbondingDelegation[],
      ]) => validators.map((validator) => buildValidatorDefinition(validator, pool, delegations, delegatorRewards, selfValidator, unbondingDelegations))),
    );
  }

  public getUserValidatorAddress(): Observable<Wallet['validatorAddress']> {
    return this.authService.getActiveUser().pipe(
      map((account) => account.wallet.validatorAddress),
    );
  }

  public getValidatorDistribution(): Observable<number | string> {
    return this.distributionService.getValidatorRewards().pipe(
      map((validatorRewards) => validatorRewards[0].amount),
    );
  }
}

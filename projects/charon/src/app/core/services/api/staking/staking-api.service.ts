import { Injectable } from '@angular/core';
import {
  Delegation,
  getDelegations,
  getPool,
  getRedelegations,
  getStakingParameters,
  getValidator,
  getValidatorDelegations,
  getValidators,
  Pool,
  Redelegation,
  RedelegationsFilterParameters,
  StakingParameters,
  Validator,
  ValidatorsFilterParameters,
  Wallet,
} from 'decentr-js';

@Injectable()
export class StakingApiService {
  public getDelegations(api: string, walletAddress: Wallet['address']): Promise<Delegation[]> {
    return getDelegations(api, walletAddress);
  }

  public getValidatorDelegation(
    api: string,
    validatorAddress: Validator['operator_address'],
    walletAddress: Wallet['address'],
  ): Promise<Delegation> {
    return getValidatorDelegations(api, validatorAddress, walletAddress).catch(() => void 0);
  }

  public getPool(api: string): Promise<Pool> {
    return getPool(api);
  }

  public getRedelegations(api: string, filter?: RedelegationsFilterParameters): Promise<Redelegation[]> {
    return getRedelegations(api, filter);
  }

  public getValidators(api: string, filter?: ValidatorsFilterParameters): Promise<Validator[]> {
    return getValidators(api, filter);
  }

  public getValidator(api: string, address: Validator['operator_address']): Promise<Validator> {
    return getValidator(api, address);
  }

  public getStakingParameters(api: string): Promise<StakingParameters> {
    return getStakingParameters(api);
  }
}

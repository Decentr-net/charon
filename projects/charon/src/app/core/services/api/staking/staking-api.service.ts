import { Injectable } from '@angular/core';
import {
  Delegation,
  getDelegations,
  getPool,
  getRedelegations,
  getStakingParameters,
  getUnbondingDelegations,
  getValidator,
  getValidators,
  Pool,
  Redelegation,
  RedelegationsFilterParameters,
  StakingParameters,
  UnbondingDelegation,
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
    delegatorAddress: Wallet['address'],
    validatorAddress: Validator['operator_address'],
  ): Promise<Delegation> {
    return getDelegations(api, delegatorAddress, validatorAddress).catch(() => void 0);
  }

  public getPool(api: string): Promise<Pool> {
    return getPool(api);
  }

  public getValidatorUndelegation(
    api: string,
    delegatorAddress: Wallet['address'],
    fromValidatorAddress: Validator['operator_address'],
  ): Promise<UnbondingDelegation> {
    return getUnbondingDelegations(api, delegatorAddress, fromValidatorAddress);
  }

  public getRedelegations(api: string, filter?: RedelegationsFilterParameters): Promise<Redelegation[]> {
    return getRedelegations(api, filter).catch(() => []);
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

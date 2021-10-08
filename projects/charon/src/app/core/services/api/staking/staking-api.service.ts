import { Injectable } from '@angular/core';
import {
  Delegation,
  getDelegations,
  getPool,
  getValidator, getValidatorDelegations,
  getValidators,
  Pool,
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

  public getValidators(api: string, filter?: ValidatorsFilterParameters): Promise<Validator[]> {
    return getValidators(api, filter);
  }

  public getValidator(api: string, address: Validator['operator_address']): Promise<Validator> {
    return getValidator(api, address);
  }
}
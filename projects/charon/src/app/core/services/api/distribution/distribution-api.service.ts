import { Injectable } from '@angular/core';
import {
  DelegatorRewards,
  DenomAmount,
  getDelegatorRewards,
  getValidatorDistribution,
  Validator,
  ValidatorDistribution,
  Wallet,
} from 'decentr-js';

@Injectable()
export class DistributionApiService {
  public getDelegatorRewards(
    api: string,
    delegatorAddress: Wallet['address'],
    validatorAddress?: Validator['operator_address'],
  ): Promise<DelegatorRewards | DenomAmount[]> {
    return getDelegatorRewards(api, delegatorAddress, validatorAddress);
  }

  public getValidatorDistribution(
    api: string,
    validatorAddress: Validator['operator_address'],
  ): Promise<ValidatorDistribution> {
    return getValidatorDistribution(api, validatorAddress);
  }
}

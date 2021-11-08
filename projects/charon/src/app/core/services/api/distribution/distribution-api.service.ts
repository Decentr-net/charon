import { Injectable } from '@angular/core';
import { DelegatorRewards, DenomAmount, getDelegatorRewards, getValidatorRewards, Validator, Wallet } from 'decentr-js';

@Injectable()
export class DistributionApiService {
  public getDelegatorRewards(
    api: string,
    delegatorAddress: Wallet['address'],
    validatorAddress?: Validator['operator_address'],
  ): Promise<DelegatorRewards | DenomAmount[]> {
    return getDelegatorRewards(api, delegatorAddress, validatorAddress);
  }

  public getValidatorRewards(
    api: string,
    validatorAddress: Validator['operator_address'],
  ): Promise<DenomAmount[]> {
    return getValidatorRewards(api, validatorAddress);
  }
}

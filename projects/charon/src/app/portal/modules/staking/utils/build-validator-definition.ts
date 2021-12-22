import {
  Coin,
  DelegationResponse,
  Pool,
  QueryDelegationTotalRewardsResponse,
  UnbondingDelegation,
  Validator,
  Wallet,
} from 'decentr-js';

import { ValidatorDefinition, ValidatorDefinitionShort } from '../models';

export const buildValidatorOperatorDefinition = (
  validator: Validator,
  delegations: DelegationResponse[],
  validatorRewards: Coin[],
  unbondingDelegations: UnbondingDelegation[],
): ValidatorDefinitionShort => {
  return {
    address: validator.operatorAddress,
    delegated: delegations
      .find((delegation) => delegation.delegation.validatorAddress === validator.operatorAddress)
      ?.balance.amount,
    jailed: validator.jailed,
    name: validator.description.moniker,
    reward: +validatorRewards[0].amount,
    unbondingDelegation: (unbondingDelegations.find((delegation) => delegation.validatorAddress === validator.operatorAddress)
      ?.entries || []).reduce((acc, delegation) => ({
        balance: acc.balance + +delegation.balance,
        completionTime: acc.completionTime > new Date(delegation.completionTime) ? acc.completionTime : new Date(delegation.completionTime),
      }), {
        balance: 0,
        completionTime: undefined,
      }),
  };
};

export const buildValidatorDefinitionShort = (
  validator: Validator,
  delegations: DelegationResponse[],
  delegatorRewards: QueryDelegationTotalRewardsResponse,
  unbondingDelegations: UnbondingDelegation[],
): ValidatorDefinitionShort => {
  return {
    address: validator.operatorAddress,
    delegated: delegations
      .find((delegation) => delegation.delegation.validatorAddress === validator.operatorAddress)
      ?.balance.amount,
    jailed: validator.jailed,
    name: validator.description.moniker,
    reward: +(delegatorRewards.rewards || [])
      .find((delegatorReward) => {
        return delegatorReward.validatorAddress === validator.operatorAddress && delegatorReward?.reward?.length;
      })?.reward[0]?.amount || 0,
    unbondingDelegation: (unbondingDelegations.find((delegation) => delegation.validatorAddress === validator.operatorAddress)
      ?.entries || []).reduce((acc, delegation) => ({
        balance: acc.balance + +delegation.balance,
        completionTime: acc.completionTime > new Date(delegation.completionTime) ? acc.completionTime : new Date(delegation.completionTime),
      }), {
        balance: 0,
        completionTime: undefined,
      }),
  };
};

export const buildValidatorDefinition = (
  validator: Validator,
  pool: Pool,
  delegations: DelegationResponse[],
  delegatorRewards: QueryDelegationTotalRewardsResponse,
  selfValidator: Wallet['validatorAddress'],
  unbondingDelegations: UnbondingDelegation[],
): ValidatorDefinition => {
  return {
    ...buildValidatorDefinitionShort(validator, delegations, delegatorRewards, unbondingDelegations),
    commission: validator.commission.commissionRates.rate,
    details: validator.description.details,
    selfValidator: validator.operatorAddress === selfValidator,
    status: validator.status,
    tokens: validator.tokens,
    votingPower: +validator.tokens / +pool.bondedTokens,
    website: validator.description.website,
  };
};

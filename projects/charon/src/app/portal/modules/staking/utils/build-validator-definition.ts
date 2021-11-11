import {
  Delegation,
  DelegatorRewards,
  Pool,
  UnbondingDelegation,
  Validator,
  ValidatorDistribution,
  Wallet,
} from 'decentr-js';

import { ValidatorDefinition, ValidatorDefinitionShort } from '../models';

export const buildValidatorOperatorDefinition = (
  validator: Validator,
  delegations: Delegation[],
  validatorRewards: ValidatorDistribution,
  unbondingDelegations: UnbondingDelegation[],
): ValidatorDefinitionShort => {
  return {
    address: validator.operator_address,
    delegated: delegations
      .find((delegation) => delegation.validator_address === validator.operator_address)
      ?.balance.amount,
    jailed: validator.jailed,
    name: validator.description.moniker,
    reward: [...(validatorRewards.self_bond_rewards || []), ...(validatorRewards.val_commission || [])]
      .reduce((acc, { amount }) => acc + +amount, 0),
    unbondingDelegation: (unbondingDelegations.find((delegation) => delegation.validator_address === validator.operator_address)
      ?.entries || []).reduce((acc, delegation) => ({
        balance: acc.balance + +delegation.balance,
        completionTime: acc.completionTime > new Date(delegation.completion_time) ? acc.completionTime : new Date(delegation.completion_time),
      }), {
        balance: 0,
        completionTime: undefined,
      }),
  };
};

export const buildValidatorDefinitionShort = (
  validator: Validator,
  delegations: Delegation[],
  delegatorRewards: DelegatorRewards,
  unbondingDelegations: UnbondingDelegation[],
): ValidatorDefinitionShort => {
  return {
    address: validator.operator_address,
    delegated: delegations
      .find((delegation) => delegation.validator_address === validator.operator_address)
      ?.balance.amount,
    jailed: validator.jailed,
    name: validator.description.moniker,
    reward: +(delegatorRewards.rewards || [])
      .find((delegatorReward) => {
        return delegatorReward.validator_address === validator.operator_address && delegatorReward?.reward?.length;
      })?.reward[0]?.amount || 0,
    unbondingDelegation: (unbondingDelegations.find((delegation) => delegation.validator_address === validator.operator_address)
      ?.entries || []).reduce((acc, delegation) => ({
        balance: acc.balance + +delegation.balance,
        completionTime: acc.completionTime > new Date(delegation.completion_time) ? acc.completionTime : new Date(delegation.completion_time),
      }), {
        balance: 0,
        completionTime: undefined,
      }),
  };
};

export const buildValidatorDefinition = (
  validator: Validator,
  pool: Pool,
  delegations: Delegation[],
  delegatorRewards: DelegatorRewards,
  selfValidator: Wallet['validatorAddress'],
  unbondingDelegations: UnbondingDelegation[],
): ValidatorDefinition => {
  return {
    ...buildValidatorDefinitionShort(validator, delegations, delegatorRewards, unbondingDelegations),
    commission: validator.commission.commission_rates.rate,
    details: validator.description.details,
    selfValidator: validator.operator_address === selfValidator,
    status: validator.status,
    tokens: validator.tokens,
    votingPower: +validator.tokens / pool.bonded_tokens,
    website: validator.description.website,
  };
};

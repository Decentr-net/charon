import { Delegation, DelegatorRewards, DenomAmount, Pool, Validator } from 'decentr-js';

import { ValidatorDefinition, ValidatorDefinitionShort, ValidatorOperatorDefinitionShort } from '../models';

export const buildValidatorOperatorDefinition = (
  validator: Validator,
  validatorRewards: DenomAmount[],
): ValidatorOperatorDefinitionShort => {
  return {
    address: validator.operator_address,
    jailed: validator.jailed,
    name: validator.description.moniker,
    reward: +(validatorRewards || [])[0].amount || 0,
  };
};

export const buildValidatorDefinitionShort = (
  validator: Validator,
  delegations: Delegation[],
  delegatorRewards: DelegatorRewards,
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
  };
};

export const buildValidatorDefinition = (
  validator: Validator,
  pool: Pool,
  delegations: Delegation[],
  delegatorRewards: DelegatorRewards,
): ValidatorDefinition => {
  return {
    ...buildValidatorDefinitionShort(validator, delegations, delegatorRewards),
    commission: validator.commission.commission_rates.rate,
    details: validator.description.details,
    status: validator.status,
    tokens: validator.tokens,
    votingPower: +validator.tokens / pool.bonded_tokens,
    website: validator.description.website,
  };
};

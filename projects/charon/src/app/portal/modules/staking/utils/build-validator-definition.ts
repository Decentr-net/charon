import {
  Coin,
  DelegationResponse,
  Pool,
  protoTimestampToDate,
  QueryDelegationTotalRewardsResponse,
  UnbondingDelegation,
  Validator,
  Wallet,
} from 'decentr-js';

import { ValidatorDefinition, ValidatorDefinitionShort } from '../models';

const buildUnbondingDelegation = (
  validatorAddress: Validator['operatorAddress'],
  unbondingDelegations: UnbondingDelegation[],
): {
  balance: number;
  completionTime: Date;
} => {
  const validatorUnbondingDelegations = unbondingDelegations
    .find((delegation) => delegation.validatorAddress === validatorAddress);

  return (validatorUnbondingDelegations?.entries || []).reduce((acc, delegation) => ({
    balance: acc.balance + +delegation.balance,
    completionTime: acc.completionTime > protoTimestampToDate(delegation.completionTime)
      ? acc.completionTime
      : protoTimestampToDate(delegation.completionTime)
  }), {
    balance: 0,
    completionTime: undefined,
  });
};

const getDelegatedAmount = (
  validatorAddress: Validator['operatorAddress'],
  delegations: DelegationResponse[],
): Coin['amount'] => {
  return delegations
    .find((delegation) => delegation.delegation.validatorAddress === validatorAddress)
      ?.balance.amount;
}

const buildPartialValidatorDefinition = (
  validator: Validator,
  delegations: DelegationResponse[],
  unbondingDelegations: UnbondingDelegation[],
): Omit<ValidatorDefinitionShort, 'reward'> => {
  return {
    address: validator.operatorAddress,
    delegated: +getDelegatedAmount(validator.operatorAddress, delegations),
    jailed: validator.jailed,
    name: validator.description.moniker,
    unbondingDelegation: buildUnbondingDelegation(validator.operatorAddress, unbondingDelegations),
  };
}

export const buildValidatorOperatorDefinition = (
  validator: Validator,
  delegations: DelegationResponse[],
  validatorRewards: Coin[],
  unbondingDelegations: UnbondingDelegation[],
): ValidatorDefinitionShort => {
  return {
    ...buildPartialValidatorDefinition(validator, delegations, unbondingDelegations),
    reward: +validatorRewards[0].amount,
  };
};

export const buildValidatorDefinitionShort = (
  validator: Validator,
  delegations: DelegationResponse[],
  delegatorRewards: QueryDelegationTotalRewardsResponse,
  unbondingDelegations: UnbondingDelegation[],
): ValidatorDefinitionShort => {
  return {
    ...buildPartialValidatorDefinition(validator, delegations, unbondingDelegations),
    reward: +(delegatorRewards.rewards || [])
      .find((delegatorReward) => {
        return delegatorReward.validatorAddress === validator.operatorAddress && delegatorReward?.reward?.length;
      })?.reward[0]?.amount || 0,
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
    commission: +validator.commission.commissionRates.rate,
    details: validator.description.details,
    selfValidator: validator.operatorAddress === selfValidator,
    status: validator.status,
    tokens: +validator.tokens,
    votingPower: +validator.tokens / +pool.bondedTokens,
    website: validator.description.website,
  };
};

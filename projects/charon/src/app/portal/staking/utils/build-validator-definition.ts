import { Delegation, Pool, Validator } from 'decentr-js';

import { ValidatorDefinition } from '../models';

export const buildValidatorDefinition = (
  validator: Validator,
  pool: Pool,
  delegations: Delegation[],
): ValidatorDefinition => {
  return {
    address: validator.operator_address,
    commission: validator.commission.commission_rates.rate,
    delegated: delegations
      .find((delegation) => delegation.validator_address === validator.operator_address)
      ?.balance.amount,
    details: validator.description.details,
    jailed: validator.jailed,
    name: validator.description.moniker,
    status: validator.status,
    tokens: validator.tokens,
    votingPower: +validator.tokens / pool.bonded_tokens,
    website: validator.description.website,
  };
};

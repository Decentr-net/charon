import { Validator } from 'decentr-js';

export interface ValidatorDefinition {
  address: Validator['operatorAddress'];
  commission: number;
  delegated: number;
  details: Validator['description']['details'];
  jailed: Validator['jailed'];
  name: Validator['description']['moniker'];
  reward: number;
  selfValidator: boolean;
  status: Validator['status'];
  tokens: number;
  website: Validator['description']['website'];
  unbondingDelegation: {
    balance: number;
    completionTime: Date;
  };
  votingPower: number;
}

export type ValidatorDefinitionShort = Pick<ValidatorDefinition, 'address' | 'delegated' | 'jailed' | 'name' | 'reward' | 'unbondingDelegation'>;

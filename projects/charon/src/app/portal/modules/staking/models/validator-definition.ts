import { Coin, Validator } from 'decentr-js';

export interface ValidatorDefinition {
  address: Validator['operatorAddress'];
  commission: Validator['commission']['commissionRates']['rate'];
  delegated: Coin['amount'];
  details: Validator['description']['details'];
  jailed: Validator['jailed'];
  name: Validator['description']['moniker'];
  reward: number;
  selfValidator: boolean;
  status: Validator['status'];
  tokens: Validator['tokens'];
  website: Validator['description']['website'];
  unbondingDelegation: {
    balance: number;
    completionTime: Date;
  };
  votingPower: number;
}

export type ValidatorDefinitionShort = Pick<ValidatorDefinition, 'address' | 'delegated' | 'jailed' | 'name' | 'reward' | 'unbondingDelegation'>;

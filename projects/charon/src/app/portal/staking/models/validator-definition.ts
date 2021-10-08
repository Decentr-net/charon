import { Delegation, Validator } from 'decentr-js';

export interface ValidatorDefinition {
  address: Validator['operator_address'];
  commission: Validator['commission']['commission_rates']['rate'];
  delegated: Delegation['balance']['amount'];
  details: Validator['description']['details'];
  jailed: Validator['jailed'];
  name: Validator['description']['moniker'];
  status: Validator['status'];
  tokens: Validator['tokens'];
  website: Validator['description']['website'];
  votingPower: number;
}
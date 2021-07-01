import { Wallet } from 'decentr-js';

export interface User {
  readonly id: string;
  readonly wallet: Wallet;
}

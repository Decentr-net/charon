import { Wallet } from 'decentr-js';

export interface User {
  readonly id: string;
  readonly registrationCompleted?: boolean;
  readonly wallet: Wallet;
}

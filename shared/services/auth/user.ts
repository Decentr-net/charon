import { ProfileUpdate, Wallet } from 'decentr-js';

export interface User extends Partial<ProfileUpdate> {
  readonly id: string;
  readonly registrationCompleted?: boolean;
  readonly wallet: Wallet;
}

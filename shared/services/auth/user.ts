import { PrivateProfile, PublicProfile, Wallet } from 'decentr-js';

export interface UserPrivate extends PrivateProfile {
  readonly emails: string[];
  readonly usernames: string[];
}

export interface User extends Partial<UserPrivate>, Partial<PublicProfile> {
  readonly id: string;
  readonly wallet: Wallet;
}

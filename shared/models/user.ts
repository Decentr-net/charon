import { Wallet } from './wallet';

export enum Gender {
  Male = 'male',
  Female = 'female',
}

export interface UserPublic {
  readonly birthday: string;
  readonly gender: Gender;
}

export interface UserPrivate {
  readonly emails: string[];
  readonly usernames: string[];
}

export interface User extends Partial<UserPrivate>, Partial<UserPublic>, Omit<Wallet, 'address'> {
  readonly id: string;
  readonly walletAddress: string;
}

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

export interface User extends UserPrivate, UserPublic {
  readonly id: string;
  readonly privateKey: string;
  readonly publicKey: string;
  readonly walletAddress: string;
}

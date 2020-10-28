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

export interface AccountCoin {
  readonly amount: string;
  readonly denom: string;
}

export interface AccountPublicKey {
  readonly type: string;
  readonly value: string;
}

export interface Account {
  readonly account_number: string;
  readonly address?: string;
  readonly coins: AccountCoin[];
  readonly public_key?: AccountPublicKey;
  readonly sequence: string;
}

export interface GetUserPrivateResponse {
  readonly result: string;
}

export interface GetUserPublicResponse {
  readonly result: UserPublic;
}

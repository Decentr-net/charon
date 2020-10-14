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

export interface Account {
  readonly address: string;
  readonly coins: [];
  readonly public_key: string;
  readonly account_number: number;
  readonly sequence: number
}

export interface GetUserPrivateResponse {
  readonly result: string;
}

export interface GetUserPublicResponse {
  readonly result: UserPublic;
}

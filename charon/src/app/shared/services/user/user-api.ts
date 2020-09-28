export enum Gender {
  Male = 'male',
  Female = 'female',
}

export interface UserPublic {
  readonly birthDate: number;
  readonly gender: Gender;
}

export interface UserPrivate {
  readonly emails: string[];
  readonly usernames: string[];
}

export interface UserCreateRequest {
  readonly walletAddress: string;
  readonly email: string;
}

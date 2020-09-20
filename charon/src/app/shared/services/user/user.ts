export enum Gender {
  Male = 'male',
  Female = 'female',
}

export interface UserPublic {
  birthDate: number;
  gender: Gender;
  emails: string[];
  usernames: string[];
}

export interface UserCreate extends UserPublic {
  password: string;
  seedPhrase: string;
}

export interface User extends UserPublic {
  passwordHash: string;
  privateKey: string;
}

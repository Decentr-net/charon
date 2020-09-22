export enum Gender {
  Male = 'male',
  Female = 'female',
}

export interface UserData {
  birthDate: number;
  gender: Gender;
  emails: string[];
  usernames: string[];
}

export interface UserCreateRequest extends UserData {
  publicKey: string;
}

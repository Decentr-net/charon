export enum Gender {
  Male = 'male',
  Female = 'female',
}

export interface UserCreate {
  birthDate: number;
  gender: Gender;
  emails: string[];
  usernames: string[];
  publicKey: string;
}

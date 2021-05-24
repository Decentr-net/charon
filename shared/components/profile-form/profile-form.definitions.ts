import { ProfileUpdate } from 'decentr-js';

export enum ProfileFormControlName {
  Avatar = 'avatar',
  Bio = 'bio',
  Birthday = 'birthday',
  Emails = 'emails',
  EmailValue = 'value',
  FirstName = 'firstName',
  Gender = 'gender',
  LastName = 'lastName',
  PrimaryEmail = 'primaryEmail',
  // Usernames = 'usernames',
  // UsernameValue = 'value',
}

export type ArrayControlName = ProfileFormControlName.Emails;

export interface TranslationsConfig {
  read: string;
  scope?: string;
}

export type ProfileFormControlValue = Partial<ProfileUpdate> & {
  primaryEmail?: string;
  // usernames?: string[];
}

export interface UsernameForm {
  value: string;
}

export interface EmailForm {
  value: string;
}

export interface ProfileForm extends Omit<ProfileFormControlValue, 'emails'> {
  emails?: EmailForm[];
  // usernames?: UsernameForm[];
}

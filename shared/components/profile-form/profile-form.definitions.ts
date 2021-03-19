import { UserPrivate } from '../../services/auth';
import { PublicProfile } from 'decentr-js';

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
  Usernames = 'usernames',
  UsernameValue = 'value',
}

export type ArrayControlName = ProfileFormControlName.Emails | ProfileFormControlName.Usernames;

export interface TranslationsConfig {
  read: string;
  scope?: string;
}

export type ProfileFormControlValue = Partial<Omit<UserPrivate, 'registrationCompleted'> & PublicProfile>;

export interface UsernameForm {
  value: string;
}

export interface EmailForm {
  value: string;
}

export interface ProfileForm extends Partial<Omit<ProfileFormControlValue, 'emails' | 'usernames'>> {
  emails?: EmailForm[];
  usernames?: UsernameForm[];
}

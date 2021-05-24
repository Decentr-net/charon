import { User } from '@shared/services/auth';

export interface AuthUser extends User {
  emailConfirmed: boolean;
  isModerator: boolean;
  passwordHash: string;
  primaryEmail: string;
  // usernames: string[];
}

export type AuthUserCreate = Partial<AuthUser> & { password: string };

export type AuthUserUpdate
  = Partial<Pick<AuthUser, 'avatar' | 'bio' | 'birthday' | 'firstName' | 'gender' | 'emails' | 'lastName'> & { password: string }>;

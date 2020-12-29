import { User } from '@shared/services/auth';

export interface AuthUser extends User {
  readonly emailConfirmed: boolean;
  readonly isModerator: boolean;
  readonly passwordHash: string;
  readonly primaryUsername?: string;
}

export type AuthUserCreate = Partial<AuthUser> & Pick<AuthUser, 'primaryEmail'> & { password: string };

export type AuthUserUpdate
  = Partial<Pick<AuthUser, 'avatar' | 'birthday' | 'firstName' | 'gender' | 'emails' | 'lastName' | 'usernames'> & { password: string }>;

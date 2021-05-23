import { User } from '@shared/services/auth';

export interface AuthUser extends User {
  readonly emailConfirmed: boolean;
  readonly isModerator: boolean;
  readonly passwordHash: string;
  readonly primaryEmail: string;
  readonly usernames: string[];
}

export type AuthUserCreate = Partial<AuthUser> & { password: string };

export type AuthUserUpdate
  = Partial<Pick<AuthUser, 'avatar' | 'bio' | 'birthday' | 'firstName' | 'gender' | 'emails' | 'lastName' | 'usernames'> & { password: string }>;

import { User } from '@root-shared/services/auth';

export interface AuthUser extends User {
  readonly emailConfirmed: boolean;
  readonly primaryEmail: string;
  readonly primaryUsername?: string;
  readonly passwordHash: string;
  readonly registrationCompleted: boolean;
}

export type AuthUserCreate = Partial<AuthUser> & Pick<AuthUser, 'primaryEmail'> & { password: string };

export type AuthUserUpdate
  = Partial<Pick<AuthUser, 'birthday' | 'gender' | 'emails' | 'usernames'> & { password: string }>;

import { User } from '@shared/services/auth';

export interface AuthUser extends User {
  emailConfirmed: boolean;
  isModerator: boolean;
  passwordHash: string;
  primaryEmail?: string; // registrationEmail
}

export type AuthUserCreate = Partial<AuthUser> & { password: string };

export interface AuthUserUpdate {
  password: string
}

import { User } from '@shared/services/auth';

export interface AuthUser extends User {
  passwordHash: string;
  primaryEmail?: string; // registrationEmail
}

export type AuthUserCreate = Partial<Omit<AuthUser, 'id'>> & { password: string };

export interface AuthUserUpdate {
  password: string;
}

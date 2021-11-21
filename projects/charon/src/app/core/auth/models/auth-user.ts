import { User } from '@shared/services/auth';

export interface AuthUser extends User {
  encryptedSeed?: string;
  passwordHash: string;
  primaryEmail?: string; // registrationEmail
}

export type AuthUserCreate = Partial<Omit<AuthUser, 'id'>> & {
  password: string;
  seed: string;
};

export interface AuthUserUpdate {
  oldPassword?: string;
  password: string;
}

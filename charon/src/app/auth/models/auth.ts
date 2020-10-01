import { UserPrivate, UserPublic } from '@shared/services/user';

export const AUTH_STORE_SECTION_KEY = 'auth';

export interface User extends UserPrivate, Partial<UserPublic> {
  readonly id: string;
  readonly emailConfirmed: boolean;
  readonly passwordHash: string;
  readonly privateKey: string;
  readonly publicKey: string;
  readonly walletAddress: string;
}

export interface StoreData {
  readonly activeUserId: string;
  readonly users: User[];
  lastInteraction: number;
}

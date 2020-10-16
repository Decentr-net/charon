import { UserPrivate, UserPublic } from '@shared/services/user';

export interface User extends UserPrivate, UserPublic {
  readonly id: string;
  readonly emailConfirmed: boolean;
  readonly mainEmail: string;
  readonly passwordHash: string;
  readonly privateKey: string;
  readonly publicKey: string;
  readonly walletAddress: string;
}

export interface StoreData {
  readonly activeUserId: string;
  readonly users: User[];
}

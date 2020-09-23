import { UserData } from '../../shared/services/user-api';

export const AUTH_STORE_SECTION_KEY = 'auth';

export type User = UserData & {
  id: string;
  emailConfirmed: boolean;
  passwordHash: string;
  privateKey: string;
}

export interface StoreData {
  activeUserId: string;
  users: User[];
}

import { UserCreateRequest } from '../../shared/services/user-api';

export type User = Omit<UserCreateRequest, 'publicKey'> & {
  id: string;
  emailConfirmed: boolean;
  passwordHash: string;
  privateKey: string;
}

export interface StoreData {
  activeUserId: string;
  users: User[];
}

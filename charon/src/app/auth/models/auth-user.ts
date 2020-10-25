import { User } from '../../../../../shared/models/user';

export interface AuthUser extends User {
  readonly emailConfirmed: boolean;
  readonly mainEmail: string;
  readonly passwordHash: string;
}

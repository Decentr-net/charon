import { User } from '../../../../../shared/models/user';

export interface AuthUser extends User {
  readonly emailConfirmed: boolean;
  readonly primaryEmail?: string;
  readonly primaryUsername?: string;
  readonly passwordHash: string;
  readonly registrationCompleted: boolean
}

import { AuthConfirmedGuard } from './auth-confirmed.guard';
import { AuthUncompletedRegistrationGuard } from './auth-uncompleted-registration.guard';
import { AuthUnconfirmedGuard } from './auth-unconfirmed.guard';

export * from './auth-confirmed.guard';
export * from './auth-uncompleted-registration.guard';
export * from './auth-unconfirmed.guard';

export const SIGN_UP_GUARDS = [
  AuthConfirmedGuard,
  AuthUncompletedRegistrationGuard,
  AuthUnconfirmedGuard,
];

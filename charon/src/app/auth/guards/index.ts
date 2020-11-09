import { AuthConfirmedGuard } from './auth-confirmed.guard';
import { AuthUnconfirmedGuard } from './auth-unconfirmed.guard';
import { UnauthGuard } from './unauth.guard';
import { AuthCompletedRegistrationGuard } from '@auth/guards/auth-completed-registration.guard';
import { AuthUncompletedRegistrationGuard } from '@auth/guards/auth-uncompleted-registration.guard';

export * from './auth-confirmed.guard';
export * from './auth-unconfirmed.guard';
export * from './unauth.guard';

export const AUTH_GUARDS = [
  AuthConfirmedGuard,
  AuthUnconfirmedGuard,
  AuthCompletedRegistrationGuard,
  AuthUncompletedRegistrationGuard,
  UnauthGuard,
]

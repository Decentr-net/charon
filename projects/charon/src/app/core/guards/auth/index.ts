import { AuthCompletedRegistrationGuard } from './auth-completed-registration.guard';
import { UnauthGuard } from './unauth.guard';

export * from './auth-completed-registration.guard';
export * from './unauth.guard';

export const AUTH_GUARDS = [
  AuthCompletedRegistrationGuard,
  UnauthGuard,
];

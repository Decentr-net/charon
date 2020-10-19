import { AuthConfirmedGuard } from './auth-confirmed.guard';
import { AuthUnconfirmedGuard } from './auth-unconfirmed.guard';
import { UnauthGuard } from './unauth.guard';

export * from './auth-confirmed.guard';
export * from './auth-unconfirmed.guard';
export * from './unauth.guard';

export const AUTH_GUARDS = [
  AuthConfirmedGuard,
  AuthUnconfirmedGuard,
  UnauthGuard,
]

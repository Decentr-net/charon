import { AuthGuard } from './auth.guard';
import { EmailConfirmedGuard } from './email-confirmed.guard';
import { EmailUnconfirmedGuard } from './email-unconfirmed.guard';
import { UnauthGuard } from './unauth.guard';

export * from './auth.guard';
export * from './email-confirmed.guard';
export * from './email-unconfirmed.guard';
export * from './unauth.guard';

export const AUTH_GUARDS = [
  AuthGuard,
  EmailConfirmedGuard,
  EmailUnconfirmedGuard,
  UnauthGuard,
]

import { AuthGuard } from './auth.guard';
import { LockGuard } from './lock.guard';

export * from './auth.guard';
export * from './lock.guard';

export const AUTH_GUARDS = [
  AuthGuard,
  LockGuard,
]

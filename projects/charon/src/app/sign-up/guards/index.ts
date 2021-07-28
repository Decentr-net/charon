import { SignUpGuard } from './sign-up.guard';
import { EmailConfirmationGuard } from './email-confirmation.guard';
import { CompleteRegistrationGuard } from './complete-registration.guard';

export * from './complete-registration.guard';
export * from './email-confirmation.guard';
export * from './sign-up.guard';

export const SIGN_UP_GUARDS = [
  CompleteRegistrationGuard,
  EmailConfirmationGuard,
  SignUpGuard,
];

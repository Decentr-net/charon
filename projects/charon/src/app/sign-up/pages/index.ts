import { EmailConfirmationPageComponent } from './email-confirmation-page';
import { SignUpPageComponent } from './sign-up-page';
import { SuccessPageComponent } from './success-page';
import { CompleteRegistrationPageComponent } from './complete-registration-page';

export * from './complete-registration-page';
export * from './email-confirmation-page';
export * from './sign-up-page';
export * from './success-page';

export const SIGN_UP_PAGES = [
  CompleteRegistrationPageComponent,
  EmailConfirmationPageComponent,
  SignUpPageComponent,
  SuccessPageComponent,
];

import { EmailConfirmationPageComponent } from './email-confirmation-page';
import { SignUpPageComponent } from './sign-up-page';
import { SuccessPageComponent } from './success-page';

export * from './email-confirmation-page';
export * from './sign-up-page';
export * from './success-page';

export const SIGN_UP_PAGES = [
  EmailConfirmationPageComponent,
  SignUpPageComponent,
  SuccessPageComponent,
];

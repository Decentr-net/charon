import { CompleteRegistrationPageComponent } from './complete-registration-page';
import { EmailConfirmationPageComponent } from './email-confirmation-page';
import { PdvConsentComponent } from './pdv-consent';
import { SignUpPageComponent } from './sign-up-page';
import { SuccessPageComponent } from './success-page';

export * from './complete-registration-page';
export * from './email-confirmation-page';
export * from './pdv-consent';
export * from './sign-up-page';
export * from './success-page';

export const SIGN_UP_PAGES = [
  CompleteRegistrationPageComponent,
  EmailConfirmationPageComponent,
  PdvConsentComponent,
  SignUpPageComponent,
  SuccessPageComponent,
];

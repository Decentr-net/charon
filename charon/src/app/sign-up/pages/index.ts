import { AccountFormPageComponent } from './account-form-page';
import { SeedPhrasePageComponent } from './seed-phrase-page';
import { SeedPhraseTestPageComponent } from './seed-phrase-test-page';
import { EmailConfirmationPageComponent } from './email-confirmation-page';
import { SuccessPageComponent } from './success-page';

export * from './account-form-page';
export * from './email-confirmation-page';
export * from './seed-phrase-page';
export * from './seed-phrase-test-page';
export * from './success-page';

export const SIGN_UP_PAGES = [
  AccountFormPageComponent,
  EmailConfirmationPageComponent,
  SeedPhrasePageComponent,
  SeedPhraseTestPageComponent,
  SuccessPageComponent,
];

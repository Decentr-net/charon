import { DelegatePageComponent } from './delegate-page';
import { ValidatorDetailsPageComponent } from './validator-details-page';
import { ValidatorsPageComponent } from './validators-page';

export * from './delegate-page';
export * from './validator-details-page';
export * from './validators-page';

export const STAKING_PAGES = [
  DelegatePageComponent,
  ValidatorDetailsPageComponent,
  ValidatorsPageComponent,
];


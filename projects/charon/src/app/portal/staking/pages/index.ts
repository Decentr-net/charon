import { DelegatePageComponent } from './delegate-page';
import { ValidatorDetailsPageComponent } from './validator-details-page';
import { ValidatorsPageComponent } from './validators-page';
import { UndelegatePageComponent } from './undelegate-page';

export * from './delegate-page';
export * from './validator-details-page';
export * from './validators-page';
export * from './undelegate-page';

export const STAKING_PAGES = [
  DelegatePageComponent,
  ValidatorDetailsPageComponent,
  ValidatorsPageComponent,
  UndelegatePageComponent,
];


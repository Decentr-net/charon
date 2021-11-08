import { DelegatePageComponent } from './delegate-page';
import { RedelegatePageComponent } from './redelegate-page';
import { ValidatorDetailsPageComponent } from './validator-details-page';
import { ValidatorsPageComponent } from './validators-page';
import { UndelegatePageComponent } from './undelegate-page';
import { WithdrawDelegatorPageComponent } from './widthraw-delegator-page';
import { WithdrawValidatorPageComponent } from './widthraw-validator-page';

export * from './delegate-page';
export * from './redelegate-page';
export * from './validator-details-page';
export * from './validators-page';
export * from './undelegate-page';
export * from './widthraw-delegator-page';
export * from './widthraw-validator-page';

export const STAKING_PAGES = [
  DelegatePageComponent,
  RedelegatePageComponent,
  ValidatorDetailsPageComponent,
  ValidatorsPageComponent,
  UndelegatePageComponent,
  WithdrawDelegatorPageComponent,
  WithdrawValidatorPageComponent,
];

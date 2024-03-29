import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  DelegatePageComponent,
  RedelegatePageComponent,
  UndelegatePageComponent,
  ValidatorDetailsPageComponent,
  ValidatorsPageComponent,
  WithdrawDelegatorPageComponent,
  WithdrawValidatorPageComponent,
} from './pages';
import { ExistingValidatorGuard, STAKING_GUARDS } from './guards';
import { StakingRoute } from './staking-route';

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ValidatorsPageComponent,
  },
  {
    path: StakingRoute.Withdraw,
    component: WithdrawDelegatorPageComponent,
  },
  {
    path: `:${StakingRoute.ValidatorAddressParam}`,
    canActivate: [
      ExistingValidatorGuard,
    ],
    children: [
      {
        path: '',
        component: ValidatorDetailsPageComponent,
        pathMatch: 'full',
      },
      {
        path: StakingRoute.Delegate,
        component: DelegatePageComponent,
      },
      {
        path: StakingRoute.Redelegate,
        component: RedelegatePageComponent,
      },
      {
        path: StakingRoute.Undelegate,
        component: UndelegatePageComponent,
      },
      {
        path: StakingRoute.Withdraw,
        component: WithdrawValidatorPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES),
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    STAKING_GUARDS,
  ],
})
export class StakingRoutingModule {
}

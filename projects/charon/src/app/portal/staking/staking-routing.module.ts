import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DelegatePageComponent, ValidatorDetailsPageComponent, ValidatorsPageComponent } from './pages';
import { StakingRoute } from './staking-route';

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ValidatorsPageComponent,
  },
  {
    path: `:${StakingRoute.ValidatorAddressParam}`,
    component: ValidatorDetailsPageComponent,
  },
  {
    path: `:${StakingRoute.ValidatorAddressParam}/${StakingRoute.Delegate}`,
    component: DelegatePageComponent,
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
  ],
})
export class StakingRoutingModule {
}

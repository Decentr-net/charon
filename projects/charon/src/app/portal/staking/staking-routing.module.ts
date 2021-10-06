import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ValidatorDetailsPageComponent, ValidatorsPageComponent } from './pages';
import { StakingRoute } from './staking-route';

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ValidatorsPageComponent,
  },
  {
    path: `:${StakingRoute.ValidatorParam}`,
    component: ValidatorDetailsPageComponent,
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

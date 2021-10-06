import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ValidatorsPageComponent } from './pages';

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ValidatorsPageComponent,
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

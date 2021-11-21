import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PdvRatePageComponent } from './pages';

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: PdvRatePageComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES),
  ],
  exports: [
    RouterModule,
  ],
})
export class PdvRateRoutingModule {
}

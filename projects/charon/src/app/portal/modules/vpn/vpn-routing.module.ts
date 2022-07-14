import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VpnPageComponent } from './pages';

const ROUTES: Routes = [
  {
    path: '',
    component: VpnPageComponent,
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
export class VpnRoutingModule {
}

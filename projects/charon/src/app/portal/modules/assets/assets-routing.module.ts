import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PortalRoute } from '../../portal-route';
import { AssetsPageComponent, TransferPageComponent } from './pages';

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AssetsPageComponent,
  },
  {
    path: PortalRoute.Transfer,
    component: TransferPageComponent,
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
export class AssetsRoutingModule {
}

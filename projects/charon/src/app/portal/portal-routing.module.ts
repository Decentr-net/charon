import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ActivityPageComponent, AssetsPageComponent, PdvRatePageComponent, PortalPageComponent } from './pages';
import { PortalRoute } from './portal-route';

const ROUTES: Routes = [
  {
    path: '',
    component: PortalPageComponent,
    children: [
      {
        path: '',
        redirectTo: PortalRoute.PDVRate,
      },
      {
        path: PortalRoute.PDVRate,
        component: PdvRatePageComponent,
      },
      {
        path: PortalRoute.Activity,
        component: ActivityPageComponent,
      },
      {
        path: PortalRoute.Assets,
        component: AssetsPageComponent,
      },
      {
        path: '**',
        redirectTo: '',
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
})
export class PortalRoutingModule {
}

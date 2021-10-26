import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BrowserTabGuard } from '@core/guards';
import { PortalPageComponent } from './pages';
import { PortalRoute } from './portal-route';
import { PORTAL_GUARDS, VpnGuard } from './guards';

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
        loadChildren: () => import('./modules').then((m) => m.PdvRateModule),
      },
      {
        path: PortalRoute.Activity,
        loadChildren: () => import('./modules').then((m) => m.ActivityModule),
      },
      {
        path: PortalRoute.Assets,
        loadChildren: () => import('./modules').then((m) => m.AssetsModule),
      },
      {
        path: PortalRoute.VPN,
        loadChildren: () => import('./modules').then((m) => m.VpnModule),
        canActivate: [
          VpnGuard,
        ],
      },
      {
        path: PortalRoute.Staking,
        loadChildren: () => import('./modules').then((m) => m.StakingModule),
        canActivate: [
          BrowserTabGuard,
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
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
    PORTAL_GUARDS,
  ],
})
export class PortalRoutingModule {
}

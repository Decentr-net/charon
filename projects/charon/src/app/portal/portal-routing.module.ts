import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BrowserTabGuard } from '@core/guards';
import {
  ActivityPageComponent,
  AssetsPageComponent,
  PdvRatePageComponent,
  PortalPageComponent,
  TransferPageComponent,
  VpnPageComponent,
} from './pages';
import { PortalRoute } from './portal-route';
import { VpnGuard } from '../core/guards/vpn.guard';

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
        children: [
          {
            path: '',
            component: AssetsPageComponent,
          },
          {
            path: PortalRoute.Transfer,
            component: TransferPageComponent,
          },
        ],
      },
      {
        path: PortalRoute.VPN,
        component: VpnPageComponent,
        canActivate: [
          VpnGuard,
        ],
      },
      {
        path: PortalRoute.Staking,
        loadChildren: () => import('./staking/staking.module').then((m) => m.StakingModule),
        canActivate: [
          BrowserTabGuard,
        ],
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

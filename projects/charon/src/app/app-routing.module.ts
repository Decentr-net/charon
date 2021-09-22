import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BrowserTabGuard, MaintenanceGuard, OfflineGuard, SupportedVersionGuard, UpdateGuard } from '@core/guards';
import { AuthCompletedRegistrationGuard, UnauthGuard } from '@core/guards';
import { AuthorizedLayoutComponent } from '@core/layout/authorized-layout';
import { PUBLIC_LAYOUT_INCLUDE_LOGO_KEY, PublicLayoutComponent } from '@core/layout/public-layout';
import { LockGuard } from '@core/lock';
import { AppRoute } from './app-route';

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: AppRoute.Hub,
  },
  {
    path: AppRoute.Login,
    component: PublicLayoutComponent,
    data: {
      [PUBLIC_LAYOUT_INCLUDE_LOGO_KEY]: true,
    },
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
    canActivate: [
      SupportedVersionGuard,
    ],
  },
  {
    path: AppRoute.SignUp,
    component: PublicLayoutComponent,
    data: {
      [PUBLIC_LAYOUT_INCLUDE_LOGO_KEY]: true,
    },
    loadChildren: () => import('./sign-up/sign-up.module').then(m => m.SignUpModule),
    canActivate: [
      SupportedVersionGuard,
      BrowserTabGuard,
    ],
  },
  {
    path: AppRoute.User,
    component: AuthorizedLayoutComponent,
    loadChildren: () => import('./user/user.module').then(x => x.UserModule),
    canLoad: [
      AuthCompletedRegistrationGuard,
    ],
    canActivate: [
      SupportedVersionGuard,
      AuthCompletedRegistrationGuard,
      LockGuard,
      BrowserTabGuard,
    ],
    canDeactivate: [
      LockGuard,
    ],
  },
  {
    path: AppRoute.Portal,
    component: AuthorizedLayoutComponent,
    loadChildren: () => import('./portal/portal.module').then(x => x.PortalModule),
    canLoad: [
      AuthCompletedRegistrationGuard,
    ],
    canActivate: [
      SupportedVersionGuard,
      AuthCompletedRegistrationGuard,
      LockGuard,
    ],
    canDeactivate: [
      LockGuard,
    ],
  },
  {
    path: AppRoute.Welcome,
    component: PublicLayoutComponent,
    loadChildren: () => import('./welcome/welcome.module').then(m => m.WelcomeModule),
    canLoad: [
      UnauthGuard,
    ],
    canActivate: [
      SupportedVersionGuard,
      BrowserTabGuard,
      UnauthGuard,
    ],
  },
  {
    path: AppRoute.Hub,
    component: AuthorizedLayoutComponent,
    loadChildren: () => import('./hub/hub.module').then(m => m.HubModule),
    canLoad: [
      AuthCompletedRegistrationGuard,
    ],
    canActivate: [
      SupportedVersionGuard,
      BrowserTabGuard,
      AuthCompletedRegistrationGuard,
      LockGuard,
    ],
    canDeactivate: [
      LockGuard,
    ],
  },
  {
    path: AppRoute.Update,
    loadChildren: () => import('./technical/technical.module').then(m => m.TechnicalModule),
    canActivate: [
      UpdateGuard,
    ],
    data: {
      i18nPageKey: 'update_page',
    },
  },
  {
    path: AppRoute.Maintenance,
    loadChildren: () => import('./technical/technical.module').then(m => m.TechnicalModule),
    canActivate: [
      MaintenanceGuard,
    ],
    data: {
      i18nPageKey: 'maintenance_page',
    },
  },
  {
    path: AppRoute.Offline,
    loadChildren: () => import('./technical/technical.module').then(m => m.TechnicalModule),
    canActivate: [
      OfflineGuard,
    ],
    data: {
      i18nPageKey: 'offline_page',
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(ROUTES, { useHash: true })
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule {
}

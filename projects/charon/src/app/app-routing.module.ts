import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BrowserTabGuard, SupportedVersionGuard, UpdateGuard } from '@core/guards';
import {
  AuthCompletedRegistrationGuard,
  UnauthGuard,
} from '@core/auth';
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
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
    canActivate: [
      SupportedVersionGuard,
    ],
  },
  {
    path: AppRoute.SignUp,
    loadChildren: () => import('./sign-up/sign-up.module').then(m => m.SignUpModule),
    canActivate: [
      SupportedVersionGuard,
      BrowserTabGuard,
    ],
  },
  {
    path: AppRoute.User,
    loadChildren: () => import('./user/user.module').then(x => x.UserModule),
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
    data: {
      i18nPageKey: 'maintenance_page',
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

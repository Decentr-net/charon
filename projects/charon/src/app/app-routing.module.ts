import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BrowserTabGuard } from '@core/guards';
import { AuthCompletedRegistrationGuard, AuthConfirmedGuard, UnauthGuard } from '@core/auth';
import { LockGuard } from '@core/lock';
import { AppRoute } from './app-route';

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: AppRoute.Circle,
  },
  {
    path: AppRoute.Login,
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
  },
  {
    path: AppRoute.SignUp,
    loadChildren: () => import('./sign-up/sign-up.module').then(m => m.SignUpModule),
    canLoad: [
      UnauthGuard,
    ],
    canActivate: [
      BrowserTabGuard,
      UnauthGuard,
    ],
  },
  {
    path: AppRoute.User,
    loadChildren: () => import('./user/user.module').then(x => x.UserModule),
    canLoad: [
      AuthCompletedRegistrationGuard,
    ],
    canActivate: [
      AuthConfirmedGuard,
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
      BrowserTabGuard,
      UnauthGuard,
    ],
  },
  {
    path: AppRoute.Circle,
    loadChildren: () => import('./circle/circle.module').then(m => m.CircleModule),
    canLoad: [
      AuthCompletedRegistrationGuard,
    ],
    canActivate: [
      BrowserTabGuard,
      AuthCompletedRegistrationGuard,
      LockGuard,
    ],
    canDeactivate: [
      LockGuard,
    ],
  }
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

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
    redirectTo: AppRoute.User,
  },
  {
    path: AppRoute.Login,
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
  },
  {
    path: AppRoute.SignUp,
    loadChildren: () => import('./sign-up/sign-up.module').then(m => m.SignUpModule),
    canActivate: [
      BrowserTabGuard,
    ],
  },
  {
    path: AppRoute.User,
    loadChildren: () => import('./user/user.module').then(x => x.UserModule),
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
    canActivate: [
      BrowserTabGuard,
      UnauthGuard,
    ],
  },
  {
    path: AppRoute.Circle,
    loadChildren: () => import('./circle/circle.module').then(m => m.CircleModule),
    canActivate: [
      AuthCompletedRegistrationGuard,
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

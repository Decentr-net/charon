import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BrowserTabGuard } from './shared/guards';
import { AuthGuard, LockGuard } from './auth';
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
      AuthGuard,
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
    ],
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

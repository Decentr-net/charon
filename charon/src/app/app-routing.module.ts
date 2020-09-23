import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppRoute } from './app-route';

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: AppRoute.Welcome,
  },
  {
    path: AppRoute.Login,
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
  },
  {
    path: AppRoute.SignUp,
    loadChildren: () => import('./sign-up/sign-up.module').then(m => m.SignUpModule),
  },
  {
    path: AppRoute.User,
    loadChildren: () => import('./user/user.module').then(x => x.UserModule)
  },
  {
    path: AppRoute.Welcome,
    loadChildren: () => import('./welcome/welcome.module').then(m => m.WelcomeModule),
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

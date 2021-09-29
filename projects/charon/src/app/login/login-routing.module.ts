import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthCompletedRegistrationGuard, BrowserTabGuard, UnauthGuard } from '@core/guards';
import { ImportRestorePageComponent, ImportRestorePageType, LoginPageComponent } from './pages';
import { LOGIN_GUARDS, LoginGuard } from './guards';
import { LoginRoute } from './login-route';

const ROUTES: Routes = [
  {
    path: '',
    component: LoginPageComponent,
    canActivate: [
      LoginGuard,
      AuthCompletedRegistrationGuard,
    ],
  },
  {
    path: LoginRoute.Import,
    component: ImportRestorePageComponent,
    data: { pageType: ImportRestorePageType.IMPORT_ACCOUNT },
    canActivate: [
      BrowserTabGuard,
      UnauthGuard,
    ],
  },
  {
    path: LoginRoute.Restore,
    component: ImportRestorePageComponent,
    data: { pageType: ImportRestorePageType.RESTORE_ACCOUNT },
    canActivate: [
      LoginGuard,
      BrowserTabGuard,
      AuthCompletedRegistrationGuard,
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
  providers: [
    LOGIN_GUARDS,
  ],
})
export class LoginRoutingModule {
}

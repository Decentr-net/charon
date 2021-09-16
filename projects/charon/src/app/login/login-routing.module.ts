import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthCompletedRegistrationGuard, BrowserTabGuard, UnauthGuard } from '@core/guards';
import { MainLayoutComponent, MainLayoutModule } from '../layout/main-layout';
import { PublicLayoutModule } from '../layout/public-layout';
import { ImportRestorePageComponent, ImportRestorePageType, LoginPageComponent } from './pages';
import { LOGIN_GUARDS, LoginGuard } from './guards';
import { LoginRoute } from './login-route';

const ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: LoginPageComponent,
      },
    ],
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
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: ImportRestorePageComponent,
        data: { pageType: ImportRestorePageType.RESTORE_ACCOUNT },
      },
    ],
    canActivate: [
      LoginGuard,
      BrowserTabGuard,
      AuthCompletedRegistrationGuard,
    ],
  },
];

@NgModule({
  imports: [
    MainLayoutModule,
    PublicLayoutModule,
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

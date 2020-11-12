import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainLayoutComponent, MainLayoutModule } from '@shared/components/main-layout';
import { PublicLayoutComponent, PublicLayoutModule } from '@shared/components/public-layout';
import { AuthConfirmedGuard, UnauthGuard } from '@core/auth';
import { BrowserTabGuard } from '@core/guards';
import { ImportRestorePageComponent, ImportRestorePageType, LoginPageComponent } from './pages';
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
      AuthConfirmedGuard,
    ],
  },
  {
    path: LoginRoute.Import,
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        component: ImportRestorePageComponent,
        data: { pageType: ImportRestorePageType.IMPORT_ACCOUNT },
      },
    ],
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
      BrowserTabGuard,
      AuthConfirmedGuard,
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
})
export class LoginRoutingModule {
}

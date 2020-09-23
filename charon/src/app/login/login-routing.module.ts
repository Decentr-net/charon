import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainLayoutComponent, MainLayoutModule } from '../shared/components/main-layout';
import { LoginPageComponent } from './pages/login-page';
import { LoginRoute } from './login-route';
import { PublicLayoutComponent, PublicLayoutModule } from '../shared/components/public-layout';
import { ImportRestorePageComponent, ImportRestorePageType } from './pages/import-restore';

const ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: MainLayoutComponent,
        children: [
          {
            path: '',
            component: LoginPageComponent,
          },
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
      },
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

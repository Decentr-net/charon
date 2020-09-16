import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './public/components/login-page/login-page.component';
import { MainLayoutComponent, MainLayoutModule } from './shared/components/main-layout';
import { ImportAccountSeedPhraseComponent } from './public/components/import-account-seed-phrase/import-account-seed-phrase.component';
import { AppRoute } from './app-route';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: AppRoute.Initialize,
  },
  {
    path: AppRoute.Initialize,
    loadChildren: () => import('src/app/public/public.module').then(x => x.PublicModule)
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: AppRoute.Login,
        component: LoginPageComponent
      },
      {
        path: AppRoute.RestoreAccount,
        component: ImportAccountSeedPhraseComponent,
        data: { pageType: 'restore-account' }
      }
    ]
  },
  {
    path: AppRoute.User,
    loadChildren: () => import('src/app/user/user.module').then(x => x.UserModule)
  }
];

@NgModule({
  imports: [
    MainLayoutModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './public/components/login-page/login-page.component';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { ImportAccountSeedPhraseComponent } from './public/components/import-account-seed-phrase/import-account-seed-phrase.component';


const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/initialize/welcome'
      }
    ]
  },
  {
    path: 'initialize',
    loadChildren: () => import('src/app/public/public.module').then(x => x.PublicModule)
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginPageComponent
      },
      {
        path: 'restore-account',
        component: ImportAccountSeedPhraseComponent,
        data: { pageType: 'restore-account' }
      }
    ]
  },
  {
    path: 'user',
    loadChildren: () => import('src/app/user/user.module').then(x => x.UserModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

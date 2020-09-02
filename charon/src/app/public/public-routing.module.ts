import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicLayoutComponent } from './components/public-layout/public-layout.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { ImportAccountSeedPhraseComponent } from './components/import-account-seed-phrase/import-account-seed-phrase.component';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { SecretPhraseComponent } from './components/secret-phrase/secret-phrase.component';

const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/initialize/welcome'
      },
      {
        path: 'new-user',
        component: NewUserComponent
      },
      {
        path: 'import-account-seed-phrase',
        component: ImportAccountSeedPhraseComponent
      },
      {
        path: 'create-account',
        component: CreateAccountComponent
      },
      {
        path: 'secret-phrase',
        component: SecretPhraseComponent
      }
    ],
  },
  {
    path: 'welcome',
    component: WelcomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule {
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicLayoutComponent } from './components/public-layout/public-layout.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { ImportAccountSeedPhraseComponent } from './components/import-account-seed-phrase/import-account-seed-phrase.component';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { SecretPhraseComponent } from './components/secret-phrase/secret-phrase.component';
import { SuccessfulRegistrationComponent } from './components/successful-registration/successful-registration.component';
import { SecretPhraseConfirmationPageComponent } from './components/secret-phrase-confirmation-page';
import { PublicRoute } from './public-route';
import { EmailConfirmationPageComponent } from './components/email-confirmation-page';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: PublicRoute.Welcome,
      },
      {
        path: PublicRoute.Welcome,
        component: WelcomeComponent
      },
      {
        path: '',
        component: PublicLayoutComponent,
        children: [
          {
            path: PublicRoute.NewUser,
            component: NewUserComponent
          },
          {
            path: PublicRoute.ImportAccount,
            component: ImportAccountSeedPhraseComponent,
            data: { pageType: 'import-account' }
          },
          {
            path: PublicRoute.CreateAccount,
            component: CreateAccountComponent
          },
          {
            path: PublicRoute.SecretPhrase,
            component: SecretPhraseComponent
          },
          {
            path: PublicRoute.SecretPhraseConfirmation,
            component: SecretPhraseConfirmationPageComponent,
          },
          {
            path: PublicRoute.EmailConfirmation,
            component: EmailConfirmationPageComponent,
          },
          {
            path: PublicRoute.SuccessfulRegistration,
            component: SuccessfulRegistrationComponent
          },
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule {
}

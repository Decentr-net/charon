import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PublicLayoutComponent, PublicLayoutModule } from '../shared/components/public-layout';
import {
  AccountFormPageComponent,
  EmailConfirmationPageComponent,
  SeedPhrasePageComponent,
  SeedPhraseTestPageComponent,
  SuccessPageComponent
} from './pages';
import { SignUpRoute } from './sign-up-route';

const ROUTES: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: SignUpRoute.AccountForm,
        pathMatch: 'full',
      },
      {
        path: SignUpRoute.AccountForm,
        component: AccountFormPageComponent
      },
      {
        path: SignUpRoute.SeedPhrase,
        component: SeedPhrasePageComponent,
      },
      {
        path: SignUpRoute.SeedPhraseTest,
        component: SeedPhraseTestPageComponent,
      },
      {
        path: SignUpRoute.EmailConfirmation,
        component: EmailConfirmationPageComponent,
      },
      {
        path: SignUpRoute.Success,
        component: SuccessPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    PublicLayoutModule,
    RouterModule.forChild(ROUTES),
  ],
  exports: [RouterModule],
})
export class SignUpRoutingModule {
}

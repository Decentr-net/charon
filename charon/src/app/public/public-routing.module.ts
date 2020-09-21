import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicLayoutComponent } from '../shared/components/public-layout';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { ImportAccountSeedPhraseComponent } from './components/import-account-seed-phrase/import-account-seed-phrase.component';
import { PublicRoute } from './public-route';
import { PublicLayoutModule } from '../shared/components/public-layout';

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
            path: PublicRoute.ImportAccount,
            component: ImportAccountSeedPhraseComponent,
            data: { pageType: 'import-account' }
          },
        ]
      },
    ]
  }
];

@NgModule({
  imports: [
    PublicLayoutModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class PublicRoutingModule {
}

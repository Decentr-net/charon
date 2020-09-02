import { NgModule } from '@angular/core';
import { PublicLayoutComponent } from './components/public-layout/public-layout.component';
import { SharedModule } from '../shared/shared.module';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { PublicRoutingModule } from './public-routing.module';
import { NewUserComponent } from './components/new-user/new-user.component';
import { PublicLayoutHeaderComponent } from './components/public-layout-header/public-layout-header.component';
import { ImportAccountSeedPhraseComponent } from './components/import-account-seed-phrase/import-account-seed-phrase.component';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { SecretPhraseComponent } from './components/secret-phrase/secret-phrase.component';

@NgModule({
  imports: [
    PublicRoutingModule,
    SharedModule
  ],
  declarations: [
    PublicLayoutComponent,
    WelcomeComponent,
    NewUserComponent,
    PublicLayoutHeaderComponent,
    ImportAccountSeedPhraseComponent,
    CreateAccountComponent,
    SecretPhraseComponent
  ],
  exports: [
    PublicRoutingModule
  ]
})
export class PublicModule {
}

import { NgModule } from '@angular/core';
import { PublicLayoutComponent } from './components/public-layout/public-layout.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { PublicRoutingModule } from './public-routing.module';
import { NewUserComponent } from './components/new-user/new-user.component';
import { ImportAccountSeedPhraseComponent } from './components/import-account-seed-phrase/import-account-seed-phrase.component';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { SecretPhraseComponent } from './components/secret-phrase/secret-phrase.component';
import { SuccessfulRegistrationComponent } from './components/successful-registration/successful-registration.component';
import { LayoutHeaderModule } from '../shared/components/layout-header';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { InlineSVGModule } from 'ng-inline-svg';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  imports: [
    CommonModule,
    InlineSVGModule,
    LayoutHeaderModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    PublicRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [
    PublicLayoutComponent,
    WelcomeComponent,
    NewUserComponent,
    ImportAccountSeedPhraseComponent,
    CreateAccountComponent,
    SecretPhraseComponent,
    SuccessfulRegistrationComponent
  ],
  exports: [
    PublicRoutingModule
  ]
})
export class PublicModule {
}

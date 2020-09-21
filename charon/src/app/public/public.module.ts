import { NgModule } from '@angular/core';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { PublicRoutingModule } from './public-routing.module';
import { ImportAccountSeedPhraseComponent } from './components/import-account-seed-phrase/import-account-seed-phrase.component';
import { ReactiveFormsModule } from '@angular/forms';
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
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    PublicRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [
    WelcomeComponent,
    ImportAccountSeedPhraseComponent,
  ],
  exports: [
    PublicRoutingModule
  ]
})
export class PublicModule {
}

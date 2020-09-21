import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { InlineSVGModule } from 'ng-inline-svg';

import { WELCOME_PAGES } from './pages';
import { WelcomeRoutingModule } from './welcome-routing.module';

@NgModule({
  declarations: [
    WELCOME_PAGES,
  ],
  imports: [
    InlineSVGModule,
    MatButtonModule,
    MatCardModule,
    WelcomeRoutingModule,
  ],
})
export class WelcomeModule {
}

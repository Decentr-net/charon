import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { InlineSVGModule } from 'ng-inline-svg';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';

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
    TranslocoModule,
    WelcomeRoutingModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'welcome',
    },
  ],
})
export class WelcomeModule {
}

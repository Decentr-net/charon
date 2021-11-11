import { NgModule } from '@angular/core';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';

import { NetworkSelectorModule } from '@shared/components/network-selector';
import { TypefaceModule } from '@shared/directives/typeface';
import { WELCOME_PAGES } from './pages';
import { WelcomeRoutingModule } from './welcome-routing.module';

@NgModule({
  declarations: [
    WELCOME_PAGES,
  ],
  imports: [
    NetworkSelectorModule,
    SvgIconsModule,
    TranslocoModule,
    TypefaceModule,
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

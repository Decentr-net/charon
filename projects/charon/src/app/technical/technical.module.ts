import { NgModule } from '@angular/core';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';

import { TECHNICAL_PAGES } from './pages';
import { TechnicalRoutingModule } from './technical-routing.module';

@NgModule({
  imports: [
    SvgIconsModule,
    TranslocoModule,
    TechnicalRoutingModule,
  ],
  declarations: [
    TECHNICAL_PAGES,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'technical',
    },
  ],
})
export class TechnicalModule {
}

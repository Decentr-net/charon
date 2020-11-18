import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';

import { CIRCLE_COMPONENTS } from './components';
import { CIRCLE_PAGES } from './pages';
import { CircleRoutingModule } from './circle-routing.module';

@NgModule({
  declarations: [
    CIRCLE_COMPONENTS,
    CIRCLE_PAGES,
  ],
  imports: [
    CircleRoutingModule,
    CommonModule,
    TranslocoModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'circle',
    },
  ],
})
export class CircleModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { InlineSVGModule } from 'ng-inline-svg';

import { TextEllipsisModule } from '../shared/directives/text-ellipsis';
import { SanitizeModule } from '../shared/pipes/sanitize';
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
    InlineSVGModule,
    MatDividerModule,
    SanitizeModule,
    TextEllipsisModule,
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

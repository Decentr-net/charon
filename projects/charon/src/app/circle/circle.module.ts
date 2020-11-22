import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { InlineSVGModule } from 'ng-inline-svg';

import { ColoredDistributionLineModule } from '../shared/components/colored-distribution-line';
import { ColorLabelModule } from '../shared/components/color-label';
import { TextEllipsisModule } from '../shared/directives/text-ellipsis';
import { SanitizeModule } from '../shared/pipes/sanitize';
import { CIRCLE_COMPONENTS } from './components';
import { CIRCLE_PAGES } from './pages';
import { CircleRoutingModule } from './circle-routing.module';
import { SpinnerModule } from '../core/spinner';

@NgModule({
  declarations: [
    CIRCLE_COMPONENTS,
    CIRCLE_PAGES,
  ],
  imports: [
    CircleRoutingModule,
    ColoredDistributionLineModule,
    ColorLabelModule,
    CommonModule,
    InlineSVGModule,
    MatDividerModule,
    SanitizeModule,
    SpinnerModule,
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

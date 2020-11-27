import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { InlineSVGModule } from 'ng-inline-svg';

import { AvatarModule } from '@root-shared/components/avatar';
import { ColorCircleLabelModule } from '@root-shared/components/color-circle-label';
import { SanitizeModule } from '@root-shared/pipes/sanitize';
import { ColoredDistributionLineModule } from '../shared/components/colored-distribution-line';
import { SlotModule } from '../shared/components/slot';
import { TextEllipsisModule } from '../shared/directives/text-ellipsis';
import { CIRCLE_COMPONENTS } from './components';
import { CIRCLE_DIRECTIVES } from './directives';
import { CIRCLE_PAGES } from './pages';
import { CircleRoutingModule } from './circle-routing.module';
import { LineChartModule } from '../shared/components/line-chart';

@NgModule({
  declarations: [
    CIRCLE_COMPONENTS,
    CIRCLE_DIRECTIVES,
    CIRCLE_PAGES,
  ],
  imports: [
    AvatarModule,
    CircleRoutingModule,
    ColoredDistributionLineModule,
    ColorCircleLabelModule,
    CommonModule,
    InlineSVGModule,
    LineChartModule,
    MatDialogModule,
    MatDividerModule,
    SanitizeModule,
    SlotModule,
    SvgIconsModule,
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

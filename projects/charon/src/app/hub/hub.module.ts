import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { InlineSVGModule } from 'ng-inline-svg';

import { AvatarModule } from '@shared/components/avatar';
import { ColorCircleLabelModule } from '@shared/components/color-circle-label';
import { LineChartModule } from '@shared/components/line-chart';
import { ColoredDistributionLineModule } from '@shared/components/colored-distribution-line';
import { SlotModule } from '@shared/components/slot';
import { TextEllipsisModule } from '@shared/directives/text-ellipsis';
import { SanitizeModule } from '@shared/pipes/sanitize';
import { HUB_COMPONENTS } from './components';
import { HUB_DIRECTIVES } from './directives';
import { HUB_PAGES } from './pages';
import { HubRoutingModule } from './hub-routing.module';

@NgModule({
  declarations: [
    HUB_COMPONENTS,
    HUB_DIRECTIVES,
    HUB_PAGES,
  ],
  imports: [
    AvatarModule,
    HubRoutingModule,
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
      useValue: 'hub',
    },
  ],
})
export class HubModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { QuillModule } from 'ngx-quill';
import { InlineSVGModule } from 'ng-inline-svg';

import { AvatarModule } from '@shared/components/avatar';
import { ColorCircleLabelModule } from '@shared/components/color-circle-label';
import { ColorValueDynamicModule } from '@shared/components/color-value-dynamic';
import { ColoredDistributionLineModule } from '@shared/components/colored-distribution-line';
import { LineChartModule } from '@shared/components/line-chart';
import { SlotModule } from '@shared/components/slot';
import { SpinnerModule } from '@shared/components/spinner';
import { TextEllipsisModule } from '@shared/directives/text-ellipsis';
import { SanitizeModule } from '@shared/pipes/sanitize';
import { HUB_COMPONENTS } from './components';
import { HUB_DIRECTIVES } from './directives';
import { HUB_PAGES } from './pages';
import { HUB_SERVICES } from './services';
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
    ColorValueDynamicModule,
    CommonModule,
    InlineSVGModule,
    LineChartModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    QuillModule,
    ReactiveFormsModule,
    SanitizeModule,
    SlotModule,
    SpinnerModule,
    SvgIconsModule,
    TextEllipsisModule,
    TranslocoModule,
  ],
  providers: [
    HUB_SERVICES,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'hub',
    },
  ],
})
export class HubModule {
}

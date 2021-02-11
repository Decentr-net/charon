import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { QuillModule } from 'ngx-quill';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { InlineSVGModule } from 'ng-inline-svg';

import { HUB_COMPONENTS } from './components';
import { HUB_DIRECTIVES } from './directives';
import { HUB_PAGES } from './pages';
import { HUB_SERVICES } from './services';
import { AvatarModule } from '@shared/components/avatar';
import { ColorCircleLabelModule } from '@shared/components/color-circle-label';
import { ColoredDistributionLineModule } from '@shared/components/colored-distribution-line';
import { DateAgoModule } from '@shared/pipes/date-ago';
import { FormErrorModule } from '@shared/components/form-error';
import { HubRoutingModule } from './hub-routing.module';
import { LineChartModule } from '@shared/components/line-chart';
import { MarginLabelModule } from '@shared/components/margin-label';
import { MenuModule } from '@shared/components/menu';
import { CutHtmlImagesModule } from '@shared/pipes/cut-html-images';
import { FirstParagraphModule } from '@shared/pipes/first-paragraph';
import { PdvValueModule } from '@shared/pipes/pdv-value';
import { PositiveNumberModule } from '@shared/pipes/positiveNumber';
import { PermissionsModule } from '@shared/permissions';
import { SlotModule } from '@shared/components/slot';
import { SpinnerModule } from '@shared/components/spinner';
import { TextEllipsisModule } from '@shared/directives/text-ellipsis';
import { TextClampModule } from '@shared/directives/text-clamp';
import { CoerceTimestampModule } from '@shared/pipes/coerce-timestamp';
import { TypefaceModule } from '@shared/directives/typeface';

@NgModule({
  declarations: [
    HUB_COMPONENTS,
    HUB_DIRECTIVES,
    HUB_PAGES,
  ],
  imports: [
    AvatarModule,
    CoerceTimestampModule,
    ColorCircleLabelModule,
    ColoredDistributionLineModule,
    CommonModule,
    CutHtmlImagesModule,
    DateAgoModule,
    FirstParagraphModule,
    FormErrorModule,
    HubRoutingModule,
    InlineSVGModule,
    LineChartModule,
    MarginLabelModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MenuModule,
    NgxTrimDirectiveModule,
    PdvValueModule,
    PermissionsModule,
    PositiveNumberModule,
    QuillModule,
    ReactiveFormsModule,
    SlotModule,
    SpinnerModule,
    SvgIconsModule,
    TextClampModule,
    TextEllipsisModule,
    TranslocoModule,
    TypefaceModule,
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

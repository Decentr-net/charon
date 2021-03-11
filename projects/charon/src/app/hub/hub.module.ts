import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { QuillModule } from 'ngx-quill';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

import { HUB_COMPONENTS } from './components';
import { HUB_DIRECTIVES } from './directives';
import { HUB_PAGES } from './pages';
import { HUB_SERVICES } from './services';
import { AvatarModule } from '@shared/components/avatar';
import { AutoFocusModule } from '@shared/directives/auto-focus';
import { DateAgoModule } from '@shared/pipes/date-ago';
import { DragScrollModule } from '@shared/directives/drag-scroll';
import { FormErrorModule } from '@shared/components/form-error';
import { HubRoutingModule } from './hub-routing.module';
import { LineChartModule } from '@shared/components/line-chart';
import { MarginLabelModule } from '@shared/components/margin-label';
import { MenuModule } from '@shared/components/menu';
import { MouseWheelHorizontalScrollModule } from '@shared/directives/mouse-wheel-horizontal-scroll';
import { CutHtmlImagesModule } from '@shared/pipes/cut-html-images';
import { FirstParagraphModule } from '@shared/pipes/first-paragraph';
import { PdvValueModule } from '@shared/pipes/pdv-value';
import { RouterLinkScrollAnchorModule } from '@shared/directives/router-link-scroll-anchor';
import { SlotModule } from '@shared/components/slot';
import { SpinnerModule } from '@shared/components/spinner';
import { TextEllipsisModule } from '@shared/directives/text-ellipsis';
import { TextClampModule } from '@shared/directives/text-clamp';
import { CoerceTimestampModule } from '@shared/pipes/coerce-timestamp';
import { TypefaceModule } from '@shared/directives/typeface';
import { IntersectionModule } from '@shared/directives/intersection';
import { NavigationModule } from '@core/navigation';

@NgModule({
  declarations: [
    HUB_COMPONENTS,
    HUB_DIRECTIVES,
    HUB_PAGES,
  ],
  imports: [
    AvatarModule,
    AutoFocusModule,
    CoerceTimestampModule,
    CommonModule,
    CutHtmlImagesModule,
    DateAgoModule,
    DragScrollModule,
    FirstParagraphModule,
    FormErrorModule,
    FormsModule,
    HubRoutingModule,
    IntersectionModule,
    LineChartModule,
    MarginLabelModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MenuModule,
    MouseWheelHorizontalScrollModule,
    NavigationModule,
    NgxTrimDirectiveModule,
    OverlayModule,
    PdvValueModule,
    QuillModule,
    ReactiveFormsModule,
    RouterLinkScrollAnchorModule,
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

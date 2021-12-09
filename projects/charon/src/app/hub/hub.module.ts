import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { OverlayModule } from '@angular/cdk/overlay';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

import { HUB_COMPONENTS } from './components';
import { HUB_DIRECTIVES } from './directives';
import { HUB_PAGES } from './pages';
import { AvatarModule } from '@shared/components/avatar';
import { AutoFocusModule } from '@shared/directives/auto-focus';
import { ButtonBackModule } from '@shared/components/button-back';
import { ButtonModule } from '@shared/components/button';
import { ClipboardCopiedNotificationModule } from '@shared/directives/clipboard-copied-notification';
import { DateAgoModule } from '@shared/pipes/date-ago';
import { DragScrollModule } from '@shared/directives/drag-scroll';
import { FormErrorModule } from '@shared/components/form-error';
import { HubRoutingModule } from './hub-routing.module';
import { LineChartModule } from '@shared/components/line-chart';
import { MarginLabelModule } from '@shared/components/margin-label';
import { MenuModule } from '@shared/components/menu';
import { MouseWheelHorizontalScrollModule } from '@shared/directives/mouse-wheel-horizontal-scroll';
import { NetworkSelectorModule } from '@shared/components/network-selector';
import { PdvValueModule } from '@shared/pipes/pdv-value';
import { RouterLinkScrollAnchorModule } from '@shared/directives/router-link-scroll-anchor';
import { SlotModule } from '@shared/components/slot';
import { SpinnerModule } from '@shared/components/spinner';
import { TextEditorModule } from '@shared/components/text-editor';
import { TextEllipsisModule } from '@shared/directives/text-ellipsis';
import { TextClampModule } from '@shared/directives/text-clamp';
import { TextContentModule } from '@shared/pipes/text-content';
import { CoerceTimestampModule } from '@shared/pipes/coerce-timestamp';
import { TypefaceModule } from '@shared/directives/typeface';
import { IntersectionModule } from '@shared/directives/intersection';
import { NavigationModule } from '@core/navigation';
import { AuthorizedLayoutModule } from '@core/layout/authorized-layout';

@NgModule({
  declarations: [
    HUB_COMPONENTS,
    HUB_DIRECTIVES,
    HUB_PAGES,
  ],
  imports: [
    AvatarModule,
    AuthorizedLayoutModule,
    AutoFocusModule,
    ButtonBackModule,
    ButtonModule,
    ClipboardCopiedNotificationModule,
    ClipboardModule,
    CoerceTimestampModule,
    CommonModule,
    DateAgoModule,
    DragScrollModule,
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
    NetworkSelectorModule,
    NgxSkeletonLoaderModule,
    NgxTrimDirectiveModule,
    OverlayModule,
    PdvValueModule,
    ReactiveFormsModule,
    RouterLinkScrollAnchorModule,
    SlotModule,
    SpinnerModule,
    SvgIconsModule,
    TextClampModule,
    TextContentModule,
    TextEditorModule,
    TextEllipsisModule,
    TextFieldModule,
    TranslocoModule,
    TypefaceModule,
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

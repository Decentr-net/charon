import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

import { ExpansionListModule } from '@shared/components/expansion-list';
import { FormErrorModule } from '@shared/components/form-error';
import { NetworkSelectorModule } from '@shared/components/network-selector';
import { SlotModule } from '@shared/components/slot';
import { BindQueryParamsModule } from '@shared/directives/bind-query-params';
import { BrowserViewModule } from '@shared/directives/browser-view';
import { NumericModule } from '@shared/directives/numeric';
import { IntersectionModule } from '@shared/directives/intersection';
import { TypefaceModule } from '@shared/directives/typeface';
import { MarginLabelModule } from '@shared/components/margin-label';
import { MicroValueModule } from '@shared/pipes/micro-value';
import { PdvValueModule } from '@shared/pipes/pdv-value';
import { AuthorizedLayoutModule } from '@core/layout/authorized-layout';
import { NavigationModule } from '@core/navigation';
import { PORTAL_COMPONENTS } from './components';
import { PORTAL_PAGES } from './pages';
import { PortalRoutingModule } from './portal-routing.module';

@NgModule({
  declarations: [
    PORTAL_COMPONENTS,
    PORTAL_PAGES,
  ],
  imports: [
    AuthorizedLayoutModule,
    BindQueryParamsModule,
    BrowserViewModule,
    ClipboardModule,
    CommonModule,
    FormErrorModule,
    FormsModule,
    HighchartsChartModule,
    MarginLabelModule,
    MatExpansionModule,
    MatTooltipModule,
    MicroValueModule,
    NavigationModule,
    NetworkSelectorModule,
    NgxTrimDirectiveModule,
    NumericModule,
    ExpansionListModule,
    IntersectionModule,
    NgxSkeletonLoaderModule,
    PdvValueModule,
    PortalRoutingModule,
    ReactiveFormsModule,
    SlotModule,
    SvgIconsModule,
    TranslocoModule,
    TypefaceModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'portal',
    },
  ],
})
export class PortalModule {
}

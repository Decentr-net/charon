import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

import { ButtonBackModule } from '@shared/components/button-back';
import { ButtonModule } from '@shared/components/button';
import { CurrencySymbolModule } from '@shared/components/currency-symbol';
import { ExpansionListModule } from '@shared/components/expansion-list';
import { FormErrorModule } from '@shared/components/form-error';
import { InputModule } from '@shared/components/controls/input';
import { NetworkSelectorModule } from '@shared/components/network-selector';
import { PdvTypeIconModule } from '@shared/components/pdv-type-icon';
import { SlotModule } from '@shared/components/slot';
import { BindQueryParamsModule } from '@shared/directives/bind-query-params';
import { BrowserViewModule } from '@shared/directives/browser-view';
import { NumericModule } from '@shared/directives/numeric';
import { NumberFormatModule } from '@shared/pipes/number-format';
import { IntersectionModule } from '@shared/directives/intersection';
import { TypefaceModule } from '@shared/directives/typeface';
import { MarginLabelModule } from '@shared/components/margin-label';
import { MicroValueModule } from '@shared/pipes/micro-value';
import { PdvValueModule } from '@shared/pipes/pdv-value';
import { AuthorizedLayoutModule } from '@core/layout/authorized-layout';
import { NavigationModule } from '@core/navigation';
import { PORTAL_COMPONENTS } from './components';
import { PORTAL_DIRECTIVES } from './directives';
import { PORTAL_PAGES } from './pages';
import { PortalRoutingModule } from './portal-routing.module';
import { SpinnerModule } from '@shared/components/spinner';
import { SubmitAfterValidationModule } from '@shared/directives/submit-after-validation';
import { TextEllipsisModule } from '@shared/directives/text-ellipsis';

@NgModule({
  declarations: [
    PORTAL_COMPONENTS,
    PORTAL_PAGES,
    PORTAL_DIRECTIVES,
  ],
  imports: [
    AuthorizedLayoutModule,
    BindQueryParamsModule,
    BrowserViewModule,
    ButtonBackModule,
    ButtonModule,
    ClipboardModule,
    CommonModule,
    CurrencySymbolModule,
    FormErrorModule,
    FormsModule,
    HighchartsChartModule,
    InputModule,
    MarginLabelModule,
    MatExpansionModule,
    MatMenuModule,
    MatTooltipModule,
    MicroValueModule,
    NavigationModule,
    NetworkSelectorModule,
    NgxTrimDirectiveModule,
    NumericModule,
    NumberFormatModule,
    ExpansionListModule,
    IntersectionModule,
    NgxSkeletonLoaderModule,
    PdvValueModule,
    PdvTypeIconModule,
    PortalRoutingModule,
    ReactiveFormsModule,
    SlotModule,
    SpinnerModule,
    SubmitAfterValidationModule,
    SvgIconsModule,
    TextEllipsisModule,
    TranslocoModule,
    TypefaceModule,
  ],
  providers: [
    DatePipe,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'portal',
    },
  ],
})
export class PortalModule {
}

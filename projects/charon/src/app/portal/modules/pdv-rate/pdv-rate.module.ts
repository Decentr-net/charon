import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@ngneat/transloco';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { BrowserViewModule } from '@shared/directives/browser-view';
import { ButtonModule } from '@shared/components/button';
import { CurrencySymbolModule } from '@shared/components/currency-symbol';
import { DataTableModule } from '@shared/components/data-table';
import { MarginLabelModule } from '@shared/components/margin-label';
import { MatDialogModule } from '@angular/material/dialog';
import { MicroValueModule } from '@shared/pipes/micro-value';
import { NumberFormatModule } from '@shared/pipes/number-format';
import { TypefaceModule } from '@shared/directives/typeface';
import { PdvValueModule } from '@shared/pipes/pdv-value';
import { PDV_RATE_COMPONENTS } from './components';
import { PDV_RATE_PAGES } from './pages';
import { PdvRateRoutingModule } from './pdv-rate-routing.module';

@NgModule({
  declarations: [
    PDV_RATE_COMPONENTS,
    PDV_RATE_PAGES,
  ],
  imports: [
    BrowserViewModule,
    ButtonModule,
    DataTableModule,
    CommonModule,
    CurrencySymbolModule,
    MarginLabelModule,
    MatDialogModule,
    MatTooltipModule,
    MicroValueModule,
    NgxSkeletonLoaderModule,
    NumberFormatModule,
    PdvRateRoutingModule,
    PdvValueModule,
    SvgIconsModule,
    TranslocoModule,
    TypefaceModule,
  ],
})
export class PdvRateModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@ngneat/transloco';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { MarginLabelModule } from '@shared/components/margin-label';
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
    CommonModule,
    MarginLabelModule,
    MatTooltipModule,
    NgxSkeletonLoaderModule,
    PdvRateRoutingModule,
    PdvValueModule,
    SvgIconsModule,
    TranslocoModule,
    TypefaceModule,
  ],
})
export class PdvRateModule {
}

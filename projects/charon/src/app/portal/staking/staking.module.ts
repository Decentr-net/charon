import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { ButtonModule } from '@shared/components/button';
import { ButtonBackModule } from '@shared/components/button-back';
import { CurrencySymbolModule } from '@shared/components/currency-symbol';
import { DataTableModule } from '@shared/components/data-table';
import { DetailsTableModule } from '@shared/components/details-table';
import { InputContainerModule } from '@shared/components/input-container';
import { SelectModule } from '@shared/components/controls/select';
import { TooltipModule } from '@shared/components/tooltip';
import { InputModule } from '@shared/components/controls';
import { LinkModule } from '@shared/directives/link';
import { BrowserViewModule } from '@shared/directives/browser-view';
import { SubmitSourceModule } from '@shared/directives/submit-source';
import { TypefaceModule } from '@shared/directives/typeface';
import { MicroValueModule } from '@shared/pipes/micro-value';
import { NumberFormatModule } from '@shared/pipes/number-format';
import { STAKING_COMPONENTS } from './components';
import { STAKING_PAGES } from './pages';
import { StakingRoutingModule } from './staking-routing.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    STAKING_COMPONENTS,
    STAKING_PAGES,
  ],
  imports: [
    MatAutocompleteModule,
    ButtonModule,
    ButtonBackModule,
    BrowserViewModule,
    CommonModule,
    CurrencySymbolModule,
    DataTableModule,
    DetailsTableModule,
    InputContainerModule,
    InputModule,
    LinkModule,
    MicroValueModule,
    NgxSkeletonLoaderModule,
    NumberFormatModule,
    ReactiveFormsModule,
    SelectModule,
    StakingRoutingModule,
    SvgIconsModule,
    SubmitSourceModule,
    TooltipModule,
    TranslocoModule,
    TypefaceModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'staking',
    },
  ],
})
export class StakingModule {
}

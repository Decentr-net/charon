import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserViewModule } from '@shared/directives/browser-view';
import { DataTableModule } from '@shared/components/data-table';
import { MicroValueModule } from '@shared/pipes/micro-value';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { STAKING_COMPONENTS } from './components';
import { STAKING_PAGES } from './pages';
import { StakingRoutingModule } from './staking-routing.module';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TooltipModule } from '@shared/components/tooltip';
import { TranslocoModule } from '@ngneat/transloco';
import { TypefaceModule } from '@shared/directives/typeface';
import { ValidatorJailedComponent } from './components/validator-jailed/validator-jailed.component';

@NgModule({
  declarations: [
    STAKING_COMPONENTS,
    STAKING_PAGES,
    ValidatorJailedComponent,
  ],
  imports: [
    BrowserViewModule,
    CommonModule,
    DataTableModule,
    MicroValueModule,
    NgxSkeletonLoaderModule,
    StakingRoutingModule,
    SvgIconsModule,
    TooltipModule,
    TranslocoModule,
    TypefaceModule,
  ],
  providers: [
  ],
})
export class StakingModule {
}

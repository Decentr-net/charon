import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { ExpansionListModule } from '@shared/components/expansion-list';
import { IntersectionModule } from '@shared/directives/intersection';
import { TypefaceModule } from '@shared/directives/typeface';
import { MicroValueModule } from '@shared/pipes/micro-value';
import { AuthorizedLayoutModule } from '@core/layout/authorized-layout';
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
    CommonModule,
    MatExpansionModule,
    MicroValueModule,
    ExpansionListModule,
    IntersectionModule,
    NgxSkeletonLoaderModule,
    PortalRoutingModule,
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

import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslocoModule } from '@ngneat/transloco';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { ExpansionListModule } from '@shared/components/expansion-list';
import { PdvTypeIconModule } from '@shared/components/pdv-type-icon';
import { BrowserViewModule } from '@shared/directives/browser-view';
import { IntersectionModule } from '@shared/directives/intersection';
import { TextEllipsisModule } from '@shared/directives/text-ellipsis';
import { TypefaceModule } from '@shared/directives/typeface';
import { ACTIVITY_COMPONENTS } from './components';
import { ACTIVITY_PAGES } from './pages';
import { ActivityRoutingModule } from './activity-routing.module';

@NgModule({
  declarations: [
    ACTIVITY_COMPONENTS,
    ACTIVITY_PAGES,
  ],
  imports: [
    ActivityRoutingModule,
    BrowserViewModule,
    CommonModule,
    ExpansionListModule,
    IntersectionModule,
    MatExpansionModule,
    NgxSkeletonLoaderModule,
    PdvTypeIconModule,
    TextEllipsisModule,
    TranslocoModule,
    TypefaceModule,
  ],
  providers: [
    DatePipe,
  ],
})
export class ActivityModule {
}

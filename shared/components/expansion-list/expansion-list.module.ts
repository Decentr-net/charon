import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { IntersectionModule } from '../../directives/intersection';
import { TypefaceModule } from '../../directives/typeface';
import { ButtonBackModule } from '../button-back';
import { ExpansionListCellDefDirective } from './expansion-list-cell';
import { ExpansionListComponent } from './expansion-list';
import { ExpansionListColumnComponent, ExpansionListColumnDefDirective } from './expansion-list-column';
import { ExpansionListHeaderCellDefDirective } from './expansion-list-header-cell';
import { ExpansionListColumnFooterDefDirective } from './expansion-list-column-footer';
import { ExpansionListLoadingDirective } from './expansion-list-loading';

@NgModule({
  declarations: [
    ExpansionListCellDefDirective,
    ExpansionListComponent,
    ExpansionListColumnComponent,
    ExpansionListColumnDefDirective,
    ExpansionListHeaderCellDefDirective,
    ExpansionListColumnFooterDefDirective,
    ExpansionListLoadingDirective,
  ],
  imports: [
    ButtonBackModule,
    CommonModule,
    IntersectionModule,
    SvgIconsModule,
    TypefaceModule,
  ],
  exports: [
    ExpansionListCellDefDirective,
    ExpansionListComponent,
    ExpansionListColumnDefDirective,
    ExpansionListHeaderCellDefDirective,
    ExpansionListColumnFooterDefDirective,
    ExpansionListLoadingDirective,
  ],
})
export class ExpansionListModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypefaceModule } from '../../directives/typeface';
import { ExpansionListComponent } from './expansion-list';
import { ExpansionListColumnComponent, ExpansionListColumnDefDirective } from './expansion-list-column';
import { ExpansionListHeaderCellDefDirective } from './expansion-list-header-cell';
import { ExpansionListCellDefDirective } from './expansion-list-cell';
import { ExpansionListLoadingDirective } from './expansion-list-loading';

@NgModule({
  declarations: [
    ExpansionListComponent,
    ExpansionListColumnComponent,
    ExpansionListColumnDefDirective,
    ExpansionListHeaderCellDefDirective,
    ExpansionListCellDefDirective,
    ExpansionListLoadingDirective,
  ],
  imports: [
    CommonModule,
    TypefaceModule,
  ],
  exports: [
    ExpansionListComponent,
    ExpansionListColumnDefDirective,
    ExpansionListHeaderCellDefDirective,
    ExpansionListCellDefDirective,
    ExpansionListLoadingDirective,
  ],
})
export class ExpansionListModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsTableCellDefDirective } from './details-table-cell-def.directive';
import { DetailsTableComponent } from './details-table.component';
import { TypefaceModule } from '../../directives/typeface';

@NgModule({
  declarations: [
    DetailsTableComponent,
    DetailsTableCellDefDirective,
  ],
  imports: [
    CommonModule,
    TypefaceModule,
  ],
  exports: [
    DetailsTableComponent,
    DetailsTableCellDefDirective,
  ],
})
export class DetailsTableModule {
}

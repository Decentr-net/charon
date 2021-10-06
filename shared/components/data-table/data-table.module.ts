import { NgModule } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';

import { DataTableColumnDefDirective } from './data-table-column-def.directive';
import { DataTableComponent } from './data-table.component';
import { TypefaceModule } from '../../directives/typeface';

@NgModule({
  declarations: [
    DataTableColumnDefDirective,
    DataTableComponent,
  ],
  imports: [
    CdkTableModule,
    CommonModule,
    TypefaceModule,
  ],
  exports: [
    DataTableComponent,
    DataTableColumnDefDirective,
  ],
})
export class DataTableModule {
}

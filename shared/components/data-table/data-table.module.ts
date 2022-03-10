import { NgModule } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';

import { TypefaceModule } from '../../directives/typeface';
import { DATA_TABLE_DIRECTIVES } from './directives';
import { DataTableComponent } from './data-table.component';

@NgModule({
  declarations: [
    DATA_TABLE_DIRECTIVES,
    DataTableComponent,
  ],
  imports: [
    CdkTableModule,
    CommonModule,
    MatSortModule,
    TypefaceModule,
  ],
  exports: [
    DATA_TABLE_DIRECTIVES,
    DataTableComponent,
  ],
})
export class DataTableModule {
}

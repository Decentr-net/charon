import { NgModule } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';

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
    TypefaceModule,
  ],
  exports: [
    DATA_TABLE_DIRECTIVES,
    DataTableComponent,
  ],
})
export class DataTableModule {
}

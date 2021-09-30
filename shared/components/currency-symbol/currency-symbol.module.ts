import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrencySymbolComponent } from './currency-symbol.component';

@NgModule({
  declarations: [
    CurrencySymbolComponent,
  ],
  exports: [
    CurrencySymbolComponent,
  ],
  imports: [
    CommonModule,
  ],
})
export class CurrencySymbolModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrencySymbolComponent } from './component';
import { CurrencySymbolPipe } from './pipe';
import { CurrencySymbolService } from './currency-symbol.service';

@NgModule({
  declarations: [
    CurrencySymbolComponent,
    CurrencySymbolPipe,
  ],
  exports: [
    CurrencySymbolComponent,
    CurrencySymbolPipe,
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    CurrencySymbolService,
  ],
})
export class CurrencySymbolModule {
}

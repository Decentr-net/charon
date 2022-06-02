import { NgModule } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { PricePipe } from './price.pipe';

@NgModule({
  declarations: [
    PricePipe,
  ],
  providers: [
    DecimalPipe,
    PricePipe,
  ],
  exports: [
    PricePipe,
  ],
})
export class PriceModule {
}

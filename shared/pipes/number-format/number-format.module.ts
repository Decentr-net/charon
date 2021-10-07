import { NgModule } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { NumberFormatPipe } from './number-format.pipe';

@NgModule({
  declarations: [
    NumberFormatPipe,
  ],
  providers: [
    DecimalPipe,
  ],
  exports: [
    NumberFormatPipe,
  ],
})
export class NumberFormatModule {
}

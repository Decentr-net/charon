import { NgModule } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { MicroValuePipe } from './micro-value.pipe';

@NgModule({
  declarations: [
    MicroValuePipe,
  ],
  providers: [
    DecimalPipe,
    MicroValuePipe,
  ],
  exports: [
    MicroValuePipe,
  ],
})
export class MicroValueModule {
}

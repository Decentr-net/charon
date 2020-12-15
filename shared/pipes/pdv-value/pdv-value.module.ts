import { NgModule } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { PdvValuePipe } from './pdv-value.pipe';

@NgModule({
  declarations: [
    PdvValuePipe,
  ],
  providers: [
    DecimalPipe,
  ],
  exports: [
    PdvValuePipe,
  ],
})
export class PdvValueModule {
}

import { NgModule } from '@angular/core';

import { PdvValuePipe } from './pdv-value.pipe';

@NgModule({
  declarations: [
    PdvValuePipe,
  ],
  exports: [
    PdvValuePipe,
  ],
})
export class PdvValueModule {
}

import { NgModule } from '@angular/core';

import { CoerceTimestampPipe } from './coerce-timestamp.pipe';

@NgModule({
  declarations: [
    CoerceTimestampPipe,
  ],
  exports: [
    CoerceTimestampPipe,
  ],
})
export class CoerceTimestampModule {
}

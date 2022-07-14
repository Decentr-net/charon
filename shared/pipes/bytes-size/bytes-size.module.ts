import { NgModule } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { BytesSizePipe } from './bytes-size.pipe';

@NgModule({
  declarations: [
    BytesSizePipe,
  ],
  providers: [
    DecimalPipe,
  ],
  exports: [
    BytesSizePipe,
  ],
})
export class BytesSizeModule {
}

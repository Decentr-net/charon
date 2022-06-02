import { NgModule } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { BytesSizePipePipe } from './bytes-size.pipe';

@NgModule({
  declarations: [
    BytesSizePipePipe,
  ],
  providers: [
    DecimalPipe,
  ],
  exports: [
    BytesSizePipePipe,
  ],
})
export class BytesSizeModule {
}

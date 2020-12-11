import { NgModule } from '@angular/core';

import { PositiveNumberPipe } from './positive-number.pipe';

@NgModule({
  declarations: [
    PositiveNumberPipe,
  ],
  exports: [
    PositiveNumberPipe,
  ],
})
export class PositiveNumberModule {
}

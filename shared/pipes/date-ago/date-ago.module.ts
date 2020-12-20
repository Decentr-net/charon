import { NgModule } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { DateAgoPipe } from './date-ago.pipe';

@NgModule({
  declarations: [
    DateAgoPipe,
  ],
  providers: [
    DecimalPipe,
  ],
  exports: [
    DateAgoPipe,
  ],
})
export class DateAgoModule {
}

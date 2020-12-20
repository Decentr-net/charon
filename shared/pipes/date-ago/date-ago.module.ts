import { NgModule } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

import { DateAgoPipe } from './date-ago.pipe';

@NgModule({
  imports: [
    TranslocoModule,
  ],
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

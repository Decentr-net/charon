import { NgModule } from '@angular/core';

import { NumberSuffixPipe } from './number-suffix.pipe';

@NgModule({
  declarations: [
    NumberSuffixPipe,
  ],
  exports: [
    NumberSuffixPipe,
  ],
})
export class NumberSuffixModule {
}

import { NgModule } from '@angular/core';

import { NumericDirective } from './numeric.directive';

@NgModule({
  declarations: [
    NumericDirective,
  ],
  exports: [
    NumericDirective,
  ],
})
export class NumericModule {
}

import { NgModule } from '@angular/core';

import { SubmitAfterValidationDirective } from './submit-after-validation.directive';

@NgModule({
  declarations: [
    SubmitAfterValidationDirective,
  ],
  exports: [
    SubmitAfterValidationDirective,
  ],
})
export class SubmitAfterValidationModule {
}

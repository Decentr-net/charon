import { NgModule } from '@angular/core';

import { SubmitSourceDirective } from './submit-source.directive';

@NgModule({
  declarations: [
    SubmitSourceDirective,
  ],
  exports: [
    SubmitSourceDirective,
  ],
})
export class SubmitSourceModule {
}

import { NgModule } from '@angular/core';

import { TestIdDirective } from './test-id.directive';

@NgModule({
  declarations: [
    TestIdDirective,
  ],
  exports: [
    TestIdDirective,
  ],
})
export class AutomationModule {
}

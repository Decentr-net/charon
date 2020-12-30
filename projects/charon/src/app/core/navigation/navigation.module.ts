import { NgModule } from '@angular/core';

import { NavigateBackDirective } from './navigate-back';

@NgModule({
  declarations: [
    NavigateBackDirective,
  ],
  exports: [
    NavigateBackDirective,
  ],
})
export class NavigationModule {
}

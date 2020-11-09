import { NgModule } from '@angular/core';

import { NavigateBackDirective } from './navigate-back';
import { NavigationService } from './navigation.service';

@NgModule({
  declarations: [
    NavigateBackDirective,
  ],
  exports: [
    NavigateBackDirective,
  ],
  providers: [
    NavigationService,
  ],
})
export class NavigationModule {
}

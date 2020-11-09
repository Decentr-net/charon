import { NgModule, Optional, SkipSelf } from '@angular/core';

import { NavigationModule } from './navigation';
import { SpinnerModule } from './spinner';

@NgModule({
  imports: [
    NavigationModule,
    SpinnerModule,
  ],
  exports: [
    NavigationModule,
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule has already been loaded. Import CoreModule in the AppModule only.');
    }
  }
}

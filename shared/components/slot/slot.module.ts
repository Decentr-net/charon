import { ModuleWithProviders, NgModule } from '@angular/core';

import { SlotContainerDirective } from './slot-container.directive';
import { SlotDirective } from './slot.directive';
import { SlotService } from './slot.service';

@NgModule({
  declarations: [
    SlotContainerDirective,
    SlotDirective,
  ],
  exports: [
    SlotContainerDirective,
    SlotDirective,
  ],
})
export class SlotModule {
  public static forRoot(): ModuleWithProviders<SlotModule> {
    return {
      ngModule: SlotModule,
      providers: [
        SlotService,
      ],
    };
  }
}

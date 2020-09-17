import { ModuleWithProviders, NgModule } from '@angular/core';
import { LocalStoreService } from './local-store.service';

import { ChromeStoreService } from './chrome';

@NgModule()
export class LocalStoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LocalStoreModule,
      providers: [
        {
          provide: LocalStoreService,
          useClass: ChromeStoreService,
        }
      ],
    }
  }
}

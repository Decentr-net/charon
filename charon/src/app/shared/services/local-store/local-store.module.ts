import { ModuleWithProviders, NgModule } from '@angular/core';
import { LocalStoreService } from './local-store.service';

import { ChromeStoreService } from './chrome';
import { FirefoxStoreService } from './firefox';
import { LocalStorageService } from './local-storage';

@NgModule()
export class LocalStoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LocalStoreModule,
      providers: [
        {
          provide: LocalStoreService,
          useClass: FirefoxStoreService.canUse
            ? FirefoxStoreService
            : ChromeStoreService.canUse
              ? ChromeStoreService
              : LocalStorageService,
        },
      ],
    }
  }
}

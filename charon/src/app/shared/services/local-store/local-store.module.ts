import { ModuleWithProviders, NgModule } from '@angular/core';
import { LocalStoreService } from './local-store.service';

import { environment } from '../../../../environments/environment';
import { ChromeStoreService } from './chrome';
import { LocalStorageService } from './local-storage';

@NgModule()
export class LocalStoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LocalStoreModule,
      providers: [
        {
          provide: LocalStoreService,
          useClass: environment.production ? ChromeStoreService : LocalStorageService,
        }
      ],
    }
  }
}

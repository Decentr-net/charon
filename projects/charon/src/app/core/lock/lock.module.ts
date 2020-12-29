import { ModuleWithProviders, NgModule } from '@angular/core';
import { Observable } from 'rxjs';

import { LockBrowserStorageService } from '@shared/services/lock';
import { LOCK_GUARDS } from './guards';
import { LOCK_SERVICES } from './services';
import { LOCK_ACTIVITY_SOURCE, LOCK_REDIRECT_URL } from './lock.tokens';

export interface LockConfig {
  redirectUrl: string;
  activitySource?: Observable<unknown>;
}

@NgModule()
export class LockModule {
  public static forRoot(config: LockConfig): ModuleWithProviders<LockModule> {
    return {
      ngModule: LockModule,
      providers: [
        LOCK_GUARDS,
        LOCK_SERVICES,
        {
          provide: LockBrowserStorageService,
          useClass: LockBrowserStorageService,
        },
        {
          provide: LOCK_ACTIVITY_SOURCE,
          useValue: config.activitySource,
        },
        {
          provide: LOCK_REDIRECT_URL,
          useValue: config.redirectUrl,
        },
      ],
    };
  }
}

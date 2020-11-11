import { ModuleWithProviders, NgModule } from '@angular/core';
import { Observable } from 'rxjs';

import { LOCK_GUARDS } from './guards';
import { LOCK_SERVICES } from './services';
import { LOCK_DELAY, LOCK_INTERACTION_SOURCE, LOCK_REDIRECT_URL } from './lock.tokens';

export interface LockConfig {
  delay: number;
  redirectUrl: string;
  interactionSource: Observable<unknown>;
}

@NgModule({
  providers: [
    LOCK_GUARDS,
  ],
})
export class LockModule {
  public static forRoot(config: LockConfig): ModuleWithProviders<LockModule> {
    return {
      ngModule: LockModule,
      providers: [
        LOCK_SERVICES,
        {
          provide: LOCK_DELAY,
          useValue: config.delay,
        },
        {
          provide: LOCK_INTERACTION_SOURCE,
          useValue: config.interactionSource,
        },
        {
          provide: LOCK_REDIRECT_URL,
          useValue: config.redirectUrl,
        },
      ],
    };
  }
}

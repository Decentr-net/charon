import { ModuleWithProviders, NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { LOCK_DELAY, LOCK_INTERACTION_SOURCE, LOCK_REDIRECT_URL } from './lock.tokens';

interface LockConfig {
  delay: number;
  redirectUrl: string;
  interactionSource: Observable<void>;
}

@NgModule()
export class LockModule {
  public static forRoot(config: LockConfig): ModuleWithProviders {
    return {
      ngModule: LockModule,
      providers: [
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

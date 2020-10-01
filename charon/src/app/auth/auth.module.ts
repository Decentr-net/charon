import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';

import { AuthService, LockService } from './services';
import { AUTH_GUARDS } from './guards';
import {
  LOCK_DELAY,
  LOCKED_REDIRECT_URL,
  UNAUTHORIZED_REDIRECT_URL,
  UNCONFIRMED_EMAIL_REDIRECT_URL,
} from './auth.tokens';

interface AuthModuleConfig {
  unauthorizedRedirectUrl: string;
  unconfirmedEmailUrl: string;
  lock: {
    delay: number;
    redirectUrl: string;
  },
}

export function initAuthFactory<T>(authService: AuthService): Function {
  return () => authService.init();
}

export function initLockFactory<T>(lockService: LockService): Function {
  return () => lockService.init();
}

@NgModule({
  providers: [
    AUTH_GUARDS,
  ],
})
export class AuthModule {
  static forRoot(config: AuthModuleConfig): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [
        {
          provide: LOCK_DELAY,
          useValue: config.lock.delay,
        },
        {
          provide: LOCKED_REDIRECT_URL,
          useValue: config.lock.redirectUrl,
        },
        {
          provide: UNAUTHORIZED_REDIRECT_URL,
          useValue: config.unauthorizedRedirectUrl,
        },
        {
          provide: UNCONFIRMED_EMAIL_REDIRECT_URL,
          useValue: config.unconfirmedEmailUrl,
        },
        {
          provide: APP_INITIALIZER,
          useFactory: initAuthFactory,
          deps: [AuthService],
          multi: true,
        },
        {
          provide: APP_INITIALIZER,
          useFactory: initLockFactory,
          deps: [LockService],
          multi: true,
        },
      ],
    }
  }
}

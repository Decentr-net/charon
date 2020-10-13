import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';

import { AuthService } from './services';
import { AUTH_GUARDS } from './guards';
import { UNAUTHORIZED_REDIRECT_URL, UNCONFIRMED_EMAIL_REDIRECT_URL } from './auth.tokens';

interface AuthModuleConfig {
  unauthorizedRedirectUrl: string;
  unconfirmedEmailUrl: string;
}

export function initAuthFactory<T>(authService: AuthService): Function {
  return () => authService.init();
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
      ],
    }
  }
}

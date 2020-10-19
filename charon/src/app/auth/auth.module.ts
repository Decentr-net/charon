import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';

import { AuthService } from './services';
import { AUTH_GUARDS } from './guards';
import {
  AUTHORIZED_REDIRECT_URL,
  CONFIRMED_EMAIL_REDIRECT_URL,
  UNAUTHORIZED_REDIRECT_URL,
  UNCONFIRMED_EMAIL_REDIRECT_URL
} from './auth.tokens';

interface AuthModuleConfig {
  authorizedRedirectUrl: string;
  confirmedEmailUrl: string;
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
        AuthService,
        {
          provide: AUTHORIZED_REDIRECT_URL,
          useValue: config.authorizedRedirectUrl,
        },
        {
          provide: CONFIRMED_EMAIL_REDIRECT_URL,
          useValue: config.confirmedEmailUrl,
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
      ],
    }
  }
}

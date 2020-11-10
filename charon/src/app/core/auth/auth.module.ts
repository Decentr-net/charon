import { ModuleWithProviders, NgModule } from '@angular/core';

import { AuthService } from './services';
import { AUTH_GUARDS } from './guards';
import {
  AUTHORIZED_REDIRECT_URL,
  COMPLETED_REGISTRATION_REDIRECT_URL,
  CONFIRMED_EMAIL_REDIRECT_URL,
  UNAUTHORIZED_REDIRECT_URL,
  UNCOMPLETED_REGISTRATION_REDIRECT_URL,
  UNCONFIRMED_EMAIL_REDIRECT_URL
} from './auth.tokens';

interface AuthModuleConfig {
  authorizedRedirectUrl: string;
  confirmedEmailUrl: string;
  completedRegistrationUrl: string;
  unauthorizedRedirectUrl: string;
  unconfirmedEmailUrl: string;
  uncompletedRegistrationUrl: string;
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
          provide: COMPLETED_REGISTRATION_REDIRECT_URL,
          useValue: config.completedRegistrationUrl,
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
          provide: UNCOMPLETED_REGISTRATION_REDIRECT_URL,
          useValue: config.uncompletedRegistrationUrl,
        },
        {
          provide: UNCONFIRMED_EMAIL_REDIRECT_URL,
          useValue: config.unconfirmedEmailUrl,
        },
      ],
    };
  }
}

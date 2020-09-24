import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';

import { AuthService } from './services';
import { AuthGuard } from './guards';
import { UNAUTHORIZED_REDIRECT_URL } from './auth.tokens';

interface AuthModuleConfig {
  unauthorizedRedirectUrl: string;
}

export function initAuthFactory<T>(authService: AuthService): Function {
  return () => authService.init();
}

@NgModule({
  providers: [AuthGuard],
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
          provide: APP_INITIALIZER,
          useFactory: initAuthFactory,
          deps: [AuthService],
          multi: true,
        },
      ],
    }
  }
}

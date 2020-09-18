import { APP_INITIALIZER, ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { AuthService } from './services';
import { AuthGuard } from './guards';
import { STORE_SECTION, UNAUTHORIZED_REDIRECT_URL } from './auth.tokens';

interface AuthModuleConfig {
  unauthorizedRedirectUrl: string;
  storeProvider: Provider;
  storeSection: string;
}

export function initAuthFactory(authService: AuthService): Function {
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
        config.storeProvider,
        {
          provide: UNAUTHORIZED_REDIRECT_URL,
          useValue: config.unauthorizedRedirectUrl,
        },
        {
          provide: STORE_SECTION,
          useValue: config.storeSection,
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

import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { AuthService } from './services';
import { AuthGuard } from './guards';
import { UNAUTHORIZED_REDIRECT_URL } from './auth.tokens';

interface AuthModuleConfig {
  unauthorizedRedirectUrl: string;
  storeProvider: Provider;
}

@NgModule({
  providers: [AuthGuard],
})
export class AuthModule {
  static forRoot(config: AuthModuleConfig): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [
        AuthService,
        config.storeProvider,
        {
          provide: UNAUTHORIZED_REDIRECT_URL,
          useValue: config.unauthorizedRedirectUrl,
        },
      ],
    }
  }
}

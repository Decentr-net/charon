import { ModuleWithProviders, NgModule } from '@angular/core';

import { AuthService } from './services';

@NgModule({
})
export class AuthModule {
  static forRoot(): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        AuthService,
      ],
    };
  }
}

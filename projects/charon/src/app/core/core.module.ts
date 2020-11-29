import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { fromEvent } from 'rxjs';
import { ToastrModule } from 'ngx-toastr';

import { Environment } from '@environments/environment.definitions';
import { environment } from '@environments/environment';
import { SlotModule } from '@shared/components/slot';
import { AppRoute } from '../app-route';
import { SignUpRoute } from '../sign-up';
import { AuthModule, AuthService } from './auth';
import { LockModule, LockService } from './lock';
import { CORE_GUARDS } from './guards';
import { NavigationModule } from './navigation';
import { NetworkSelectorModule, NetworkSelectorService } from './network-selector';
import { ProfileSelectorModule } from './profile-selector';
import { SvgIconRootModule } from './svg-icons';
import { TranslocoRootModule } from './transloco';
import { CORE_SERVICES } from './services';

export function initAuthAndLockFactory(authService: AuthService, lockService: LockService): () => void {
  return async () => {
    await authService.init();

    if (authService.isLoggedIn) {
      await lockService.init();
    }
  };
}

export function initNetworkFactory(networkService: NetworkSelectorService): () => void {
  return () => networkService.init();
}

@NgModule({
  imports: [
    AuthModule.forRoot({
      authorizedRedirectUrl: `/${AppRoute.User}`,
      completedRegistrationUrl: `/${AppRoute.User}`,
      confirmedEmailUrl: `/${AppRoute.User}`,
      unauthorizedRedirectUrl: `/${AppRoute.Welcome}`,
      uncompletedRegistrationUrl: `/${AppRoute.SignUp}/${SignUpRoute.CompleteRegistration}`,
      unconfirmedEmailUrl: `/${AppRoute.SignUp}/${SignUpRoute.EmailConfirmation}`,
    }),
    LockModule.forRoot({
      delay: 1000 * 60 * 5,
      interactionSource: fromEvent(document, 'click', { capture: true }),
      redirectUrl: AppRoute.Login,
    }),
    NavigationModule,
    OverlayModule,
    SlotModule.forRoot(),
    SvgIconRootModule,
    ToastrModule.forRoot({
      closeButton: true,
      positionClass: 'toast-top-center',
      timeOut: 4000,
    }),
    TranslocoRootModule,
  ],
  exports: [
    NavigationModule,
    NetworkSelectorModule,
    ProfileSelectorModule,
  ],
  providers: [
    CORE_GUARDS,
    CORE_SERVICES,
    {
      provide: Environment,
      useValue: environment,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initAuthAndLockFactory,
      deps: [AuthService, LockService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initNetworkFactory,
      deps: [NetworkSelectorService],
      multi: true,
    },
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule has already been loaded. Import CoreModule in the AppModule only.');
    }
  }
}

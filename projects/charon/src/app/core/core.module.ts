import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { fromEvent } from 'rxjs';
import { ToastrModule } from 'ngx-toastr';

import { Environment } from '@environments/environment.definitions';
import { environment } from '@environments/environment';
import { CurrencyModule } from '@shared/services/currency';
import { NetworkSelectorModule } from '@shared/components/network-selector';
import { SlotModule } from '@shared/components/slot';
import { NotificationsModule } from '@shared/services/notification';
import { PDVService } from '@shared/services/pdv';
import { ONE_MINUTE } from '@shared/utils/date';
import { ERROR_PROCESSORS, FallbackErrorProcessor } from '@core/notifications';
import { AppRoute } from '../app-route';
import { SignUpRoute } from '../sign-up';
import { AuthModule, AuthService } from './auth';
import { LockModule } from './lock';
import { CORE_GUARDS } from './guards';
import { NavigationModule } from './navigation';
import { ProfileSelectorModule } from './profile-selector';
import { SvgIconRootModule } from './svg-icons';
import { TranslocoRootModule } from './transloco';
import { CORE_SERVICES, NetworkService } from './services';

export function initAuthFactory(authService: AuthService): () => void {
  return () => authService.init();
}

export function initNetworkFactory(networkService: NetworkService): () => void {
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
    CurrencyModule.forRoot({
      api: environment.currencyApi,
    }),
    LockModule.forRoot({
      delay: ONE_MINUTE * 40,
      activitySource: fromEvent(document, 'click', { capture: true }),
      redirectUrl: AppRoute.Login,
    }),
    NavigationModule,
    NetworkSelectorModule.forRoot({
      service: NetworkService,
    }),
    NotificationsModule.forRoot({
      errorProcessors: ERROR_PROCESSORS,
      fallbackErrorProcessor: FallbackErrorProcessor,
    }),
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
      provide: PDVService,
      useFactory: (environment: Environment) => new PDVService(environment.chainId),
      deps: [Environment],
    },
    {
      provide: Environment,
      useValue: environment,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initAuthFactory,
      deps: [AuthService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initNetworkFactory,
      deps: [NetworkService],
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

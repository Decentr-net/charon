import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { OverlayModule } from '@angular/cdk/overlay';
import { ToastrModule } from 'ngx-toastr';

import { Environment } from '@environments/environment.definitions';
import { environment } from '@environments/environment';
import { MicroValuePipe } from '@shared/pipes/micro-value';
import { CurrencyModule } from '@shared/services/currency';
import { MenuModule } from '@shared/components/menu';
import { NetworkSelectorModule } from '@shared/components/network-selector';
import { SlotModule } from '@shared/components/slot';
import { NotificationsModule } from '@shared/services/notification';
import { ERROR_PROCESSORS, FallbackErrorProcessor } from '@core/notifications';
import { AppRoute } from '../app-route';
import { SignUpRoute } from '../sign-up';
import { AuthModule, AuthService } from './auth';
import { LockModule } from './lock';
import { ConfigService } from '@shared/services/configuration';
import { CORE_GUARDS } from './guards';
import { MaintenanceInterceptor } from '@core/interceptors';
import { NavigationModule, NavigationService } from './navigation';
import { PermissionsModule } from '@shared/permissions';
import { SvgIconRootModule } from './svg-icons';
import { TranslocoRootModule } from './transloco';
import { CORE_SERVICES, MenuService, NetworkService } from './services';
import { QuillRootModule } from './quill';

export function initAuthFactory(authService: AuthService): () => void {
  return () => authService.init();
}

export function isMaintenanceFactory(configService: ConfigService, navigationService: NavigationService): () => void {
  return () => {
    configService.isConfigAvailable().then((isAvailable) => {
      if (!isAvailable) {
        navigationService.redirectToMaintenancePage();
      }
    }).catch(() => {
      navigationService.redirectToMaintenancePage();
    });
  };
}

export function initNetworkFactory(networkService: NetworkService): () => void {
  return () => networkService.init();
}

@NgModule({
  imports: [
    AuthModule.forRoot({
      authorizedRedirectUrl: `/`,
      completedRegistrationUrl: `/`,
      confirmedEmailUrl: `/${AppRoute.SignUp}/${SignUpRoute.CompleteRegistration}`,
      unauthorizedRedirectUrl: `/${AppRoute.Welcome}`,
      uncompletedRegistrationUrl: `/${AppRoute.SignUp}/${SignUpRoute.CompleteRegistration}`,
      unconfirmedEmailUrl: `/${AppRoute.SignUp}/${SignUpRoute.EmailConfirmation}`,
    }),
    CurrencyModule.forRoot({
      api: environment.currencyApi,
    }),
    LockModule.forRoot({
      redirectUrl: `/${AppRoute.Login}`,
    }),
    MenuModule.forRoot({
      service: MenuService,
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
    PermissionsModule.forRoot(),
    QuillRootModule,
    SlotModule.forRoot(),
    SvgIconRootModule,
    ToastrModule.forRoot({
      closeButton: true,
      positionClass: 'toast-top-center',
      timeOut: 4000,
    }),
    TranslocoRootModule,
  ],
  providers: [
    MicroValuePipe,
    CORE_GUARDS,
    CORE_SERVICES,
    {
      provide: Environment,
      useValue: environment,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: isMaintenanceFactory,
      deps: [ConfigService, NavigationService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MaintenanceInterceptor,
      multi: true,
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

import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { ToastrModule } from 'ngx-toastr';

import { Environment } from '@environments/environment.definitions';
import { environment } from '@environments/environment';
import { MessageCode } from '@scripts/messages';
import { AnalyticsModule, AnalyticsService } from '@shared/analytics';
import { MessageBus } from '@shared/message-bus';
import { CurrencyModule } from '@shared/services/currency';
import { MenuModule } from '@shared/components/menu';
import { NetworkSelectorModule, NetworkSelectorService as BaseNetworkSelectorService } from '@shared/components/network-selector';
import { SlotModule } from '@shared/components/slot';
import { NetworkBrowserStorageService } from '@shared/services/network-storage';
import { NotificationsModule } from '@shared/services/notification';
import { PDVModule } from '@shared/services/pdv';
import { SettingsModule } from '@shared/services/settings';
import { ERROR_PROCESSORS, FallbackErrorProcessor } from '@core/notifications';
import { AppRoute } from '../app-route';
import { AuthModule, AuthService } from './auth';
import { AuthorizedLayoutModule } from './layout/authorized-layout';
import { LockModule } from './lock';
import { ConfigService, ConfigurationModule } from '@shared/services/configuration';
import { CORE_GUARDS } from './guards';
import { INTERCEPTORS_PROVIDERS } from './interceptors';
import { NavigationModule, NavigationService } from './navigation';
import { PermissionsModule } from '@shared/permissions';
import { PublicLayoutModule } from './layout/public-layout';
import { SvgIconRootModule } from './svg-icons';
import { TranslocoRootModule } from './transloco';
import { CORE_SERVICES, MenuService, NetworkSelectorService, NetworkService } from './services';
import { PermissionsService } from './permissions';
import { PasswordModule } from '@shared/components/password';

export function initAuthFactory(authService: AuthService): () => void {
  return () => authService.init();
}

export function isMaintenanceFactory(configService: ConfigService, navigationService: NavigationService): () => void {
  return () => {
    configService.getMaintenanceStatus().pipe().toPromise().then((isMaintenance) => {
      if (isMaintenance) {
        throw true;
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
    AnalyticsModule.forRoot(environment.ga),
    AuthModule.forRoot(),
    AuthorizedLayoutModule,
    ConfigurationModule,
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
    NetworkSelectorModule,
    NotificationsModule.forRoot({
      errorProcessors: ERROR_PROCESSORS,
      fallbackErrorProcessor: FallbackErrorProcessor,
    }),
    OverlayModule,
    PasswordModule.forRoot({
      validation: {
        minlength: 8,
        digit: true,
        lowerCase: true,
        specialCharacter: true,
        upperCase: true,
      },
    }),
    PDVModule,
    PermissionsModule.forRoot(PermissionsService),
    PublicLayoutModule,
    SettingsModule.forRoot(),
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
    CORE_GUARDS,
    CORE_SERVICES,
    INTERCEPTORS_PROVIDERS,
    NetworkBrowserStorageService,
    {
      provide: BaseNetworkSelectorService,
      useExisting: NetworkSelectorService,
    },
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
  constructor(
    @Optional() @SkipSelf() parentModule: CoreModule,
    analyticsService: AnalyticsService,
  ) {
    if (parentModule) {
      throw new Error('CoreModule has already been loaded. Import CoreModule in the AppModule only.');
    }

    new MessageBus().sendMessage(MessageCode.ApplicationStarted);

    analyticsService.initialize();
  }
}

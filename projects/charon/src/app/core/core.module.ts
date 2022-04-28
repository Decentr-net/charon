import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { firstValueFrom } from 'rxjs';
import { ToastrModule } from 'ngx-toastr';

import { Environment } from '@environments/environment.definitions';
import { environment } from '@environments/environment';
import { AnalyticsModule, AnalyticsService } from '@shared/analytics';
import { MenuModule } from '@shared/components/menu';
import { NetworkSelectorModule, NetworkSelectorService as BaseNetworkSelectorService } from '@shared/components/network-selector';
import { SlotModule } from '@shared/components/slot';
import { AuthBrowserStorageService } from '@shared/services/auth';
import { NetworkBrowserStorageService } from '@shared/services/network-storage';
import { NotificationsModule } from '@shared/services/notification';
import { PDVStorageService } from '@shared/services/pdv';
import { SettingsModule } from '@shared/services/settings';
import { ConfigPortSource } from '@scripts/background/config/sources/config-port-source';
import { ERROR_PROCESSORS, FallbackErrorProcessor } from '@core/notifications';
import { AppRoute } from '../app-route';
import { AuthModule, AuthService } from './auth';
import { AuthorizedLayoutModule } from './layout/authorized-layout';
import { LockModule } from './lock';
import { ConfigService, ConfigSource, ConfigurationModule } from '@shared/services/configuration';
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
import { ThemeModule } from '@shared/components/theme';

export function initAuthFactory(authService: AuthService): () => void {
  return () => authService.init();
}

export function isMaintenanceFactory(configService: ConfigService, navigationService: NavigationService): () => void {
  return () => {
    firstValueFrom(configService.getMaintenanceStatus()).then((isMaintenance) => {
      if (isMaintenance) {
        throw new Error();
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
    PermissionsModule.forRoot(PermissionsService),
    PublicLayoutModule,
    SettingsModule.forRoot(),
    SlotModule.forRoot(),
    SvgIconRootModule,
    ThemeModule.forRoot(),
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
    DecimalPipe,
    {
      provide: AuthBrowserStorageService,
      useClass: AuthBrowserStorageService,
    },
    {
      provide: NetworkBrowserStorageService,
      useClass: NetworkBrowserStorageService,
    },
    {
      provide: PDVStorageService,
      useClass: PDVStorageService,
    },
    {
      provide: BaseNetworkSelectorService,
      useExisting: NetworkSelectorService,
    },
    {
      provide: ConfigSource,
      useClass: ConfigPortSource,
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

    analyticsService.initialize();
  }
}

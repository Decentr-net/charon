import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { AvatarModule } from '@shared/components/avatar';
import { AuthBrowserStorageService } from '@shared/services/auth';
import { ColorValueDynamicModule } from '@shared/components/color-value-dynamic';
import { CurrencyModule } from '@shared/services/currency';
import { Environment } from '@environments/environment.definitions';
import { environment } from '@environments/environment';
import { NetworkBrowserStorageService } from '@shared/services/network-storage';
import { PDVService } from '@shared/services/pdv';
import { svgClose, svgLogo, svgNotification, svgSettings } from '@shared/svg-icons';
import { TranslocoRootModule } from './transloco';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AvatarModule,
    BrowserModule,
    ColorValueDynamicModule,
    CurrencyModule.forRoot({
      api: environment.currencyApi,
    }),
    HttpClientModule,
    SvgIconsModule.forRoot({
      icons: [
        svgClose,
        svgLogo,
        svgNotification,
        svgSettings,
      ],
    }),
    TranslocoRootModule,
  ],
  providers: [
    AppService,
    AuthBrowserStorageService,
    NetworkBrowserStorageService,
    {
      provide: Environment,
      useValue: environment,
    },
    {
      provide: PDVService,
      useFactory: (environment: Environment) => new PDVService(environment.chainId),
      deps: [Environment],
    },
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }

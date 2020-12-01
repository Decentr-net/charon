import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { Environment } from '@environments/environment.definitions';
import { environment } from '@environments/environment';
import { AvatarModule } from '@shared/components/avatar';
import { ColorCircleLabelModule } from '@shared/components/color-circle-label';
import { AuthBrowserStorageService } from '@shared/services/auth';
import { CurrencyModule } from '@shared/services/currency';
import { NetworkBrowserStorageService } from '@shared/services/network-storage';
import { PDVService } from '@shared/services/pdv';
import { svgClose, svgLogo, svgNotification, svgSettings } from '@shared/svg-icons';
import { TranslocoRootModule } from './transloco';
import { AppComponent } from './app.component';
import { AppService } from './app.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AvatarModule,
    BrowserModule,
    ColorCircleLabelModule,
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

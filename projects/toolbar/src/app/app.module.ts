import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { AvatarModule } from '@shared/components/avatar';
import { CurrencyModule } from '@shared/services/currency';
import { Environment } from '@environments/environment.definitions';
import { environment } from '@environments/environment';
import { LockBrowserStorageService } from '@shared/services/lock';
import { MarginLabelModule } from '@shared/components/margin-label';
import { PDVModule } from '@shared/services/pdv';
import { PdvValueModule } from '@shared/pipes/pdv-value';
import { svgClose, svgLogo } from '@shared/svg-icons';
import { TranslocoRootModule } from './transloco';
import { TOOLBAR_SERVICES } from './services';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AvatarModule,
    BrowserModule,
    CurrencyModule.forRoot({
      api: environment.currencyApi,
    }),
    HttpClientModule,
    MarginLabelModule,
    PDVModule,
    PdvValueModule,
    SvgIconsModule.forRoot({
      icons: [
        svgClose,
        svgLogo,
      ],
    }),
    TranslocoRootModule,
  ],
  providers: [
    TOOLBAR_SERVICES,
    AppService,
    {
      provide: Environment,
      useValue: environment,
    },
    {
      provide: LockBrowserStorageService,
      useClass: LockBrowserStorageService,
    },
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }

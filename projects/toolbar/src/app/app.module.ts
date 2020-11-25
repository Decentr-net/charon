import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { Environment } from '@environments/environment.definitions';
import { environment } from '@environments/environment';
import { ColorCircleLabelModule } from '@shared/components/color-circle-label';
import { svgClose, svgLogo, svgNotification, svgSettings } from '@shared/svg-icons';
import { TranslocoRootModule } from './transloco';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    ColorCircleLabelModule,
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
    {
      provide: Environment,
      useValue: environment,
    },
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }

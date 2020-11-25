import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { svgLogo } from '../../../../shared/svg-icons';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SvgIconsModule.forRoot({
      icons: [
        svgLogo,
      ],
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

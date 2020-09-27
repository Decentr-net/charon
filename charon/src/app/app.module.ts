import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { LocalStoreModule } from './shared/services/local-store';
import { TranslocoRootModule } from './shared/transloco';
import { AuthModule } from './auth';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppRoute } from './app-route';

@NgModule({
  imports: [
    AppRoutingModule,
    AuthModule.forRoot({
      unauthorizedRedirectUrl: `/${AppRoute.Welcome}`,
    }),
    BrowserModule,
    LocalStoreModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslocoRootModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

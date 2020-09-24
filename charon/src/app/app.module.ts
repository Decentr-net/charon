import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { LocalStoreModule } from './shared/services/local-store';
import { AuthModule } from './auth';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppRoute } from './app-route';

@NgModule({
  imports: [
    AppRoutingModule,
    AuthModule.forRoot({
      unauthorizedRedirectUrl: '/',
      lock: {
        delay: 1000 * 60 * 5,
        lockedRedirectUrl: AppRoute.Login,
      },
    }),
    BrowserModule,
    LocalStoreModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

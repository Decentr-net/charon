import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { LocalStoreModule, LocalStoreService } from './shared/services/local-store';
import { AuthModule, AuthStore } from './auth';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    AppRoutingModule,
    AuthModule.forRoot({
      unauthorizedRedirectUrl: '/',
      storeProvider: {
        provide: AuthStore,
        useFactory: localStore => localStore,
        deps: [LocalStoreService],
      },
      storeSection: 'AUTH',
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

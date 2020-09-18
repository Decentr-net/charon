import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { LoginPageComponent } from './public/components/login-page/login-page.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LocalStoreModule, LocalStoreService } from './shared/services/local-store';
import { AuthModule, AuthStore } from './auth';

@NgModule({
  imports: [
    BrowserModule,
    AuthModule.forRoot({
      unauthorizedRedirectUrl: '/',
      storeProvider: {
        provide: AuthStore,
        useFactory: localStore => localStore,
        deps: [LocalStoreService],
      },
    }),
    LocalStoreModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  declarations: [
    AppComponent,
    LoginPageComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

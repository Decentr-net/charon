import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { fromEvent } from 'rxjs';

import { AuthBrowserStorageService } from '../../../shared/services/auth';
import { Environment } from '@environments/environment.definitions';
import { environment } from '@environments/environment';
import { LockModule } from '@shared/features/lock';
import { TranslocoRootModule } from '@shared/transloco';
import { SignUpRoute } from './sign-up';
import { AuthModule } from './auth';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppRoute } from './app-route';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    AppRoutingModule,
    AuthModule.forRoot({
      storage: new AuthBrowserStorageService(),
      authorizedRedirectUrl: `/${AppRoute.User}`,
      confirmedEmailUrl: `/${AppRoute.User}`,
      unauthorizedRedirectUrl: `/${AppRoute.Welcome}`,
      unconfirmedEmailUrl: `/${AppRoute.SignUp}/${SignUpRoute.EmailConfirmation}`,
    }),
    LockModule.forRoot({
      delay: 1000 * 60 * 5,
      interactionSource: fromEvent(document, 'click'),
      redirectUrl: AppRoute.Login,
    }),
    ToastrModule.forRoot({
      closeButton: true,
      positionClass: 'toast-top-center',
      timeOut: 4000,
    }),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslocoRootModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    {
      provide: Environment,
      useValue: environment,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

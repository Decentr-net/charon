import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { fromEvent } from 'rxjs';

import { Environment } from '@environments/environment.definitions';
import { environment } from '@environments/environment';
import { LockModule } from '@shared/features/lock';
import { LocalStoreModule } from '@shared/services/local-store';
import { TranslocoRootModule } from '@shared/transloco';
import { SignUpRoute } from './sign-up';
import { AuthModule } from './auth';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppRoute } from './app-route';
import { ToastrModule } from 'ngx-toastr';
import { SpinnerModule } from '@shared/components/spinner';

@NgModule({
  imports: [
    AppRoutingModule,
    AuthModule.forRoot({
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
    LocalStoreModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SpinnerModule,
    TranslocoRootModule
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

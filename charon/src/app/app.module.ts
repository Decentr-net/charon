import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
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
import { SpinnerModule } from '@shared/components/spinner';
import { NetworkSelectorModule } from '@shared/components/network-selector';
import { NetworkService } from '@shared/services/network';

export function initNetworkFactory<T>(networkService: NetworkService): Function {
  return () => networkService.init();
}

@NgModule({
  imports: [
    AppRoutingModule,
    AuthModule.forRoot({
      storage: new AuthBrowserStorageService(),
      authorizedRedirectUrl: `/${AppRoute.User}`,
      completedRegistrationUrl: `/${AppRoute.User}`,
      confirmedEmailUrl: `/${AppRoute.User}`,
      unauthorizedRedirectUrl: `/${AppRoute.Welcome}`,
      uncompletedRegistrationUrl: `/${AppRoute.SignUp}/${SignUpRoute.CompleteRegistration}`,
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
    NetworkSelectorModule.forRoot({
      store: NetworkService,
    }),
    BrowserModule,
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
    NetworkService,
    {
      provide: Environment,
      useValue: environment,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initNetworkFactory,
      deps: [NetworkService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

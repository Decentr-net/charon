import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthCompletedRegistrationGuard, UnauthGuard } from '@core/guards';
import { PublicLayoutComponent, PublicLayoutModule } from '../layout/public-layout';
import { AuthConfirmedGuard, AuthUncompletedRegistrationGuard, AuthUnconfirmedGuard, SIGN_UP_GUARDS } from './guards';
import {
  CompleteRegistrationPageComponent,
  EmailConfirmationPageComponent,
  SignUpPageComponent,
  SuccessPageComponent,
} from './pages';
import { SignUpRoute } from './sign-up-route';

const ROUTES: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        component: SignUpPageComponent,
        pathMatch: 'full',
        canActivate: [
          UnauthGuard,
        ],
      },
      {
        path: SignUpRoute.EmailConfirmation,
        component: EmailConfirmationPageComponent,
        canActivate: [
          AuthUnconfirmedGuard,
        ],
      },
      {
        path: SignUpRoute.CompleteRegistration,
        component: CompleteRegistrationPageComponent,
        canActivate: [
          AuthConfirmedGuard,
          AuthUncompletedRegistrationGuard,
        ]
      },
      {
        path: SignUpRoute.Success,
        component: SuccessPageComponent,
        canActivate: [
          AuthCompletedRegistrationGuard,
        ],
      },
    ],
  },
];

@NgModule({
  imports: [
    PublicLayoutModule,
    RouterModule.forChild(ROUTES),
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    SIGN_UP_GUARDS,
  ],
})
export class SignUpRoutingModule {
}

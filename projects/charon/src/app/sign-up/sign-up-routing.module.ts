import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PublicLayoutComponent, PublicLayoutModule } from '../layout/public-layout';
import {
  AuthCompletedRegistrationGuard,
  AuthConfirmedGuard,
  AuthUncompletedRegistrationGuard,
  AuthUnconfirmedGuard,
  UnauthGuard,
} from '@core/auth';
import {
  CompleteRegistrationPageComponent,
  EmailConfirmationPageComponent,
  SignUpPageComponent,
  SuccessPageComponent
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
})
export class SignUpRoutingModule {
}

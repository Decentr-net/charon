import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PublicLayoutComponent, PublicLayoutModule } from '@shared/components/public-layout';
import { AuthConfirmedGuard, AuthUnconfirmedGuard, UnauthGuard } from '../core/auth/guards';
import {
  CompleteRegistrationPageComponent,
  EmailConfirmationPageComponent,
  SignUpPageComponent,
  SuccessPageComponent
} from './pages';
import { SignUpRoute } from './sign-up-route';
import { AuthUncompletedRegistrationGuard } from '../core/auth/guards/auth-uncompleted-registration.guard';
import { AuthCompletedRegistrationGuard } from '../core/auth/guards/auth-completed-registration.guard';

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
          AuthUncompletedRegistrationGuard,
        ]
      },
      {
        path: SignUpRoute.Success,
        component: SuccessPageComponent,
        canActivate: [
          AuthConfirmedGuard,
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

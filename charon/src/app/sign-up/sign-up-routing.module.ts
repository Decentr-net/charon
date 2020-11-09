import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PublicLayoutComponent, PublicLayoutModule } from '@shared/components/public-layout';
import { AuthConfirmedGuard, AuthUnconfirmedGuard, UnauthGuard } from '@auth/guards';
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
          // TODO: implement guard
        ]
      },
      {
        path: SignUpRoute.Success,
        component: SuccessPageComponent,
        canActivate: [
          AuthConfirmedGuard,
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

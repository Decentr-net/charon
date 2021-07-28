import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthCompletedRegistrationGuard } from '@core/guards';
import { PublicLayoutComponent, PublicLayoutModule } from '../layout/public-layout';
import {
  CompleteRegistrationGuard,
  EmailConfirmationGuard,
  PDVConsentGuard,
  SIGN_UP_GUARDS,
  SignUpGuard,
} from './guards';
import {
  CompleteRegistrationPageComponent,
  EmailConfirmationPageComponent,
  PDVConsentPageComponent,
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
          SignUpGuard,
        ],
      },
      {
        path: SignUpRoute.EmailConfirmation,
        component: EmailConfirmationPageComponent,
        canActivate: [
          EmailConfirmationGuard,
        ],
      },
      {
        path: SignUpRoute.CompleteRegistration,
        component: CompleteRegistrationPageComponent,
        canActivate: [
          CompleteRegistrationGuard,
        ]
      },
      {
        path: SignUpRoute.PDVConsent,
        component: PDVConsentPageComponent,
        canActivate: [
          PDVConsentGuard,
        ]
      },
      {
        path: SignUpRoute.Success,
        component: SuccessPageComponent,
        canActivate: [
          AuthCompletedRegistrationGuard,
        ],
      },
      {
        path: '**',
        redirectTo: '',
      }
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

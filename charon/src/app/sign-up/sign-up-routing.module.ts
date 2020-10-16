import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PublicLayoutComponent, PublicLayoutModule } from '@shared/components/public-layout';
import { EmailConfirmationPageComponent, SignUpPageComponent, SuccessPageComponent } from './pages';
import { SignUpRoute } from './sign-up-route';
import { AuthGuard, EmailConfirmedGuard, EmailUnconfirmedGuard, UnauthGuard } from '@auth/guards';

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
          AuthGuard,
          EmailUnconfirmedGuard,
        ],
      },
      {
        path: SignUpRoute.Success,
        component: SuccessPageComponent,
        canActivate: [
          AuthGuard,
          EmailConfirmedGuard,
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

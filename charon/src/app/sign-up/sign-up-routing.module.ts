import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PublicLayoutComponent, PublicLayoutModule } from '@shared/components/public-layout';
import { EmailConfirmationPageComponent, SignUpPageComponent, SuccessPageComponent } from './pages';
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
      },
      {
        path: SignUpRoute.EmailConfirmation,
        component: EmailConfirmationPageComponent,
      },
      {
        path: SignUpRoute.Success,
        component: SuccessPageComponent,
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

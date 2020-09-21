import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PublicLayoutComponent, PublicLayoutModule } from '../shared/components/public-layout';
import { NewUserPageComponent, WelcomePageComponent } from './pages';
import { WelcomeRoute } from './welcome-route';

const ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: WelcomePageComponent,
      },
      {
        path: WelcomeRoute.NewUser,
        component: PublicLayoutComponent,
        children: [
          {
            path: '',
            component: NewUserPageComponent,
          },
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
export class WelcomeRoutingModule {
}

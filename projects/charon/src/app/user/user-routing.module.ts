import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BrowserTabGuard } from '@core/guards';
import { UserLayoutComponent } from './components';
import {
  EditProfilePageComponent,
  TransferPageComponent,
  UserDetailsPageComponent,
  UserPageComponent,
} from './pages';
import { UserRoute } from './user.route';

const ROUTES: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: '',
        component: UserPageComponent,
        children: [
          {
            path: '',
            component: TransferPageComponent,
          },
          {
            path: 'details',
            component: UserDetailsPageComponent,
          },
        ],
      },
      {
        path: UserRoute.Edit,
        component: EditProfilePageComponent,
        canActivate: [
          BrowserTabGuard,
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}

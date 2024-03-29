import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditProfilePageComponent, SettingsPageComponent, UserMenuPageComponent, UserPageComponent } from './pages';
import { UserRoute } from './user-route';

const ROUTES: Routes = [
  {
    path: '',
    component: UserPageComponent,
    children: [
      {
        path: '',
        component: UserMenuPageComponent,
      },
      {
        path: UserRoute.Settings,
        component: SettingsPageComponent,
      },
    ],
  },
  {
    path: UserRoute.Edit,
    component: EditProfilePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class UserRoutingModule {
}

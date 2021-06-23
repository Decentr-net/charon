import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditProfilePageComponent, UserPageComponent } from './pages';
import { UserRoute } from './user-route';

const ROUTES: Routes = [
  {
    path: '',
    component: UserPageComponent,
    children: [
    ],
  },
  {
    path: UserRoute.Edit,
    component: EditProfilePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}

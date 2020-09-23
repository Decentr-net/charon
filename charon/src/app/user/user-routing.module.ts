import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserLayoutComponent } from './components';
import { UserPageComponent } from './pages';

const ROUTES: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: '',
        component: UserPageComponent,
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

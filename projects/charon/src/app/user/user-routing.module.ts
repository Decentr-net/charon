import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BrowserTabGuard } from '@core/guards';
import { UserLayoutComponent } from './components';
import { EditProfilePageComponent, } from './pages';

const ROUTES: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: '',
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

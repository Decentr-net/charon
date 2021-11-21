import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ActivityPageComponent } from './pages';

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ActivityPageComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES),
  ],
  exports: [
    RouterModule,
  ],
})
export class ActivityRoutingModule {
}

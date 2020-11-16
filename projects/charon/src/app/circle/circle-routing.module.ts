import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CirclePageComponent } from './pages';

const ROUTES: Routes = [
  {
    path: '',
    component: CirclePageComponent,
    pathMatch: 'full',
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
export class CircleRoutingModule {
}

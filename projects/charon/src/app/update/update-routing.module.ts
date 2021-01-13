import { RouterModule, Routes } from '@angular/router';
import { UpdatePageComponent } from './pages';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
  {
    path: '',
    component: UpdatePageComponent,
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
export class UpdateRoutingModule {
}

import { RouterModule, Routes } from '@angular/router';
import { TechnicalPageComponent } from './pages';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
  {
    path: '',
    component: TechnicalPageComponent,
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
export class TechnicalRoutingModule {
}

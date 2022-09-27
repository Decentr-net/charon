import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanPageComponent } from './pages';

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LoanPageComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES),
  ],
  exports: [
    RouterModule,
  ],
  providers: [],
})
export class LoanRoutingModule {
}

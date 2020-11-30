import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LayoutHeaderModule } from '../../../projects/charon/src/app/core/layout/layout-header';
import { MainLayoutComponent } from './main-layout.component';

@NgModule({
  imports: [
    LayoutHeaderModule,
    RouterModule,
  ],
  declarations: [MainLayoutComponent],
  exports: [MainLayoutComponent],
})
export class MainLayoutModule {
}

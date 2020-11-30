import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LayoutHeaderModule } from '../layout-header';
import { PublicLayoutComponent } from './public-layout.component';

@NgModule({
  declarations: [PublicLayoutComponent],
  imports: [
    LayoutHeaderModule,
    RouterModule,
  ],
  exports: [PublicLayoutComponent],
})
export class PublicLayoutModule {
}

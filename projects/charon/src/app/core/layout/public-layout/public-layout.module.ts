import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LayoutFooterModule } from '../layout-footer';
import { PublicLayoutComponent } from './public-layout.component';

@NgModule({
  declarations: [
    PublicLayoutComponent,
  ],
  imports: [
    LayoutFooterModule,
    RouterModule,
  ],
  exports: [
    PublicLayoutComponent,
  ],
})
export class PublicLayoutModule {
}

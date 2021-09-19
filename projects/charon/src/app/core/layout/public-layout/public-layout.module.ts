import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { LayoutFooterModule } from '../layout-footer';
import { PublicLayoutComponent } from './public-layout.component';

@NgModule({
  declarations: [
    PublicLayoutComponent,
  ],
  imports: [
    CommonModule,
    LayoutFooterModule,
    RouterModule,
    SvgIconsModule,
  ],
  exports: [
    PublicLayoutComponent,
  ],
})
export class PublicLayoutModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { InlineSVGModule } from 'ng-inline-svg';
import { RouterModule } from '@angular/router';

import { MenuModule } from '@shared/components/menu';
import { NetworkSelectorModule } from '@shared/components/network-selector';
import { LayoutHeaderComponent } from './layout-header.component';

@NgModule({
  imports: [
    CommonModule,
    InlineSVGModule,
    MatMenuModule,
    MatToolbarModule,
    MenuModule,
    NetworkSelectorModule,
    RouterModule,
  ],
  declarations: [LayoutHeaderComponent],
  exports: [LayoutHeaderComponent],
})
export class LayoutHeaderModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { InlineSVGModule } from 'ng-inline-svg';

import { NetworkSelectorModule } from '../network-selector';
import { ProfileSelectorModule } from '../profile-selector';
import { LayoutHeaderComponent } from './layout-header.component';

@NgModule({
  imports: [
    CommonModule,
    InlineSVGModule,
    MatMenuModule,
    MatToolbarModule,
    NetworkSelectorModule,
    ProfileSelectorModule,
  ],
  declarations: [LayoutHeaderComponent],
  exports: [LayoutHeaderComponent],
})
export class LayoutHeaderModule {
}

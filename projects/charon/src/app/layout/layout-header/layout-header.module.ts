import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { InlineSVGModule } from 'ng-inline-svg';

import { NetworkSelectorModule } from '@shared/components/network-selector';
import { ProfileSelectorModule } from '@core/profile-selector';
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

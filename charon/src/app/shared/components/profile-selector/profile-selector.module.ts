import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { InlineSVGModule } from 'ng-inline-svg';

import { ProfileSelectorComponent } from './profile-selector.component';

@NgModule({
  declarations: [ProfileSelectorComponent],
  imports: [
    CommonModule,
    InlineSVGModule,
    MatMenuModule,
  ],
  exports: [ProfileSelectorComponent],
})
export class ProfileSelectorModule {
}

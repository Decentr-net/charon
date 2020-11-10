import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { InlineSVGModule } from 'ng-inline-svg';
import { TranslocoModule } from '@ngneat/transloco';

import { ProfileSelectorComponent } from './profile-selector';
import { ProfileSelectorService } from './profile-selector.service';

@NgModule({
  declarations: [ProfileSelectorComponent],
  imports: [
    CommonModule,
    InlineSVGModule,
    MatMenuModule,
    TranslocoModule,
  ],
  exports: [ProfileSelectorComponent],
  providers: [ProfileSelectorService],
})
export class ProfileSelectorModule {
}

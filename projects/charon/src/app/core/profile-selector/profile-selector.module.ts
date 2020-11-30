import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { InlineSVGModule } from 'ng-inline-svg';
import { TranslocoModule } from '@ngneat/transloco';

import { AvatarModule } from '@root-shared/components/avatar';
import { ProfileSelectorComponent } from './profile-selector';
import { ProfileSelectorService } from './profile-selector.service';

@NgModule({
  imports: [
    AvatarModule,
    CommonModule,
    InlineSVGModule,
    MatMenuModule,
    TranslocoModule,
  ],
  declarations: [ProfileSelectorComponent],
  exports: [ProfileSelectorComponent],
  providers: [ProfileSelectorService],
})
export class ProfileSelectorModule {
}

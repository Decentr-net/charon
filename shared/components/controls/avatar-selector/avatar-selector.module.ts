import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { AvatarModule } from '../../avatar';
import { AvatarSelectorComponent } from './avatar-selector.component';

@NgModule({
  declarations: [
    AvatarSelectorComponent,
  ],
  imports: [
    AvatarModule,
    CommonModule,
    SvgIconsModule,
  ],
  exports: [
    AvatarSelectorComponent,
  ],
})
export class AvatarSelectorModule {
}

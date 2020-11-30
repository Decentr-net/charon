import { NgModule } from '@angular/core';

import { AvatarComponent } from './avatar.component';
import { SvgIconsModule } from '@ngneat/svg-icon';

@NgModule({
  imports: [
    SvgIconsModule,
  ],
  declarations: [
    AvatarComponent,
  ],
  exports: [
    AvatarComponent,
  ],
})
export class AvatarModule {
}

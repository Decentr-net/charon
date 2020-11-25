import { NgModule } from '@angular/core';

import { SanitizeModule } from '../../pipes/sanitize';
import { AvatarComponent } from './avatar.component';

@NgModule({
  imports: [
    SanitizeModule,
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

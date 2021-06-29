import { NgModule } from '@angular/core';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { ButtonBackComponent } from './button-back.component';

@NgModule({
  imports: [
    SvgIconsModule,
  ],
  declarations: [
    ButtonBackComponent,
  ],
  exports: [
    ButtonBackComponent,
  ],
})
export class ButtonBackModule {
}

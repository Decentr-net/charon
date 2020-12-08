import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColorMarginLabelComponent } from './color-margin-label.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ColorMarginLabelComponent,
  ],
  exports: [
    ColorMarginLabelComponent,
  ],
})
export class ColorMarginLabelModule {
}

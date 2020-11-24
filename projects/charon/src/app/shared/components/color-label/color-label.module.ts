import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColorLabelComponent } from './color-label.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ColorLabelComponent,
  ],
  exports: [
    ColorLabelComponent,
  ],
})
export class ColorLabelModule {
}


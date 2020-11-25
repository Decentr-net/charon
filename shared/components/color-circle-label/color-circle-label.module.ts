import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColorCircleLabelComponent } from './color-circle-label.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ColorCircleLabelComponent,
  ],
  exports: [
    ColorCircleLabelComponent,
  ],
})
export class ColorCircleLabelModule {
}


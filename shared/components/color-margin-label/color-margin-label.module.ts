import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { ColorMarginLabelComponent } from './color-margin-label.component';
import { PositiveNumberModule } from '../../pipes/positiveNumber';

@NgModule({
  imports: [
    CommonModule,
    PositiveNumberModule,
    SvgIconsModule,
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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColorCircleLabelModule } from '../color-circle-label';
import { ColorMarginLabelModule } from '../color-margin-label';
import { ColorValueDynamicComponent } from './color-value-dynamic.component';

@NgModule({
  imports: [
    CommonModule,
    ColorCircleLabelModule,
    ColorMarginLabelModule,
  ],
  declarations: [
    ColorValueDynamicComponent,
  ],
  exports: [
    ColorValueDynamicComponent,
  ],
})
export class ColorValueDynamicModule {
}

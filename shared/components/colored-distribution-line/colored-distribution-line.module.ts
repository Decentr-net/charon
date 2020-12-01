import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColoredDistributionLineComponent } from './colored-distribution-line.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ColoredDistributionLineComponent,
  ],
  exports: [
    ColoredDistributionLineComponent,
  ],
})
export class ColoredDistributionLineModule {
}


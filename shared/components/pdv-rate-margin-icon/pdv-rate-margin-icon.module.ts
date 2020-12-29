import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { PdvRateMarginIconComponent } from './pdv-rate-margin-icon.component';

@NgModule({
  imports: [
    CommonModule,
    SvgIconsModule,
  ],
  declarations: [
    PdvRateMarginIconComponent,
  ],
  providers: [
    DecimalPipe,
  ],
  exports: [
    PdvRateMarginIconComponent,
  ],
})
export class PdvRateMarginIconModule {
}

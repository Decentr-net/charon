import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PdvValueModule } from '@shared/pipes/pdv-value';
import { TooltipComponent } from './tooltip.component';

@NgModule({
  imports: [
    CommonModule,
    PdvValueModule,
  ],
  declarations: [
    TooltipComponent,
  ],
  exports: [
    TooltipComponent,
  ],
})
export class TooltipModule {
}

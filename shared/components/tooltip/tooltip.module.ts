import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';

import { TooltipComponent } from './tooltip.component';
import { TooltipDirective } from './tooltip.directive';
import { TypefaceModule } from '../../directives/typeface';

@NgModule({
  imports: [
    OverlayModule,
    TypefaceModule,
  ],
  declarations: [
    TooltipComponent,
    TooltipDirective,
  ],
  exports: [
    TooltipComponent,
    TooltipDirective,
  ],
})
export class TooltipModule {
}

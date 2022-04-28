import { NgModule } from '@angular/core';

import { MouseWheelHorizontalScrollDirective } from './mouse-wheel-horizontal-scroll.directive';

@NgModule({
  declarations: [
    MouseWheelHorizontalScrollDirective,
  ],
  exports: [
    MouseWheelHorizontalScrollDirective,
  ],
})
export class MouseWheelHorizontalScrollModule {
}

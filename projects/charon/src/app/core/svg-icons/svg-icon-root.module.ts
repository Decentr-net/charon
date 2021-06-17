import { NgModule } from '@angular/core';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { svgClose } from '@shared/svg-icons/close';

@NgModule({
  imports: [SvgIconsModule.forRoot({
    icons: [
      svgClose,
    ],
  })],
})
export class SvgIconRootModule {
}

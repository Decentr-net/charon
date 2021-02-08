import { NgModule } from '@angular/core';
import { SvgIconsModule } from '@ngneat/svg-icon';

import {
  svgClose,
  svgEdit,
} from '@shared/svg-icons';

@NgModule({
  imports: [SvgIconsModule.forRoot({
    icons: [
      svgClose,
      svgEdit,
    ],
  })],
})
export class SvgIconRootModule {
}

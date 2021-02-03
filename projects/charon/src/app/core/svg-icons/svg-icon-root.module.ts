import { NgModule } from '@angular/core';
import { SvgIconsModule } from '@ngneat/svg-icon';

import {
  svgClose,
  svgPlusSmall,
} from '@shared/svg-icons';

@NgModule({
  imports: [SvgIconsModule.forRoot({
    icons: [
      svgClose,
      svgPlusSmall,
    ],
  })],
})
export class SvgIconRootModule {
}

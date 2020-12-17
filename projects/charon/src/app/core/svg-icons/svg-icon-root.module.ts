import { NgModule } from '@angular/core';
import { SvgIconsModule } from '@ngneat/svg-icon';

import {
  svgClose,
  svgNotification,
  svgPlus,
  svgSettings,
} from '@shared/svg-icons';

@NgModule({
  imports: [SvgIconsModule.forRoot({
    icons: [
      svgClose,
      svgNotification,
      svgPlus,
      svgSettings,
    ],
  })],
})
export class SvgIconRootModule {
}

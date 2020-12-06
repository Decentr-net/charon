import { NgModule } from '@angular/core';
import { SvgIconsModule } from '@ngneat/svg-icon';

import {
  svgClose,
  svgNotification,
  svgPlusBold,
  svgSettings,
} from '@shared/svg-icons';

@NgModule({
  imports: [SvgIconsModule.forRoot({
    icons: [
      svgClose,
      svgNotification,
      svgPlusBold,
      svgSettings,
    ],
  })],
})
export class SvgIconRootModule {
}

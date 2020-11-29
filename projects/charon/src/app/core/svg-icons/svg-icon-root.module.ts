import { NgModule } from '@angular/core';
import { SvgIconsModule } from '@ngneat/svg-icon';

import {
  svgNotification,
  svgPlusBold,
  svgSettings,
} from '@shared/svg-icons';

@NgModule({
  imports: [SvgIconsModule.forRoot({
    icons: [
      svgNotification,
      svgPlusBold,
      svgSettings,
    ],
  })],
})
export class SvgIconRootModule {
}

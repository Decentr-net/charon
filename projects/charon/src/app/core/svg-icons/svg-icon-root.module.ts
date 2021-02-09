import { NgModule } from '@angular/core';
import { SvgIconsModule } from '@ngneat/svg-icon';

import {
  svgClose,
} from '@shared/svg-icons';

@NgModule({
  imports: [SvgIconsModule.forRoot({
    icons: [
      svgClose,
    ],
  })],
})
export class SvgIconRootModule {
}

import { NgModule } from '@angular/core';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { svgClose } from '@shared/svg-icons/close';

@NgModule({
  imports: [SvgIconsModule.forRoot({
    sizes: {
      xs: '16px',
      sm: '20px',
      md: '24px',
      lg: '32px',
      xl: '48px',
      xxl: '64px',
    },
    defaultSize: 'md',
    icons: [
      svgClose,
    ],
  })],
})
export class SvgIconRootModule {
}

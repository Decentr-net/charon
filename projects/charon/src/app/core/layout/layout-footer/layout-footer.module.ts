import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TranslocoModule } from '@ngneat/transloco';

import { TypefaceModule } from '@shared/directives/typeface';
import { LayoutFooterComponent } from './layout-footer.component';

@NgModule({
  declarations: [
    LayoutFooterComponent,
  ],
  imports: [
    CommonModule,
    SvgIconsModule,
    TranslocoModule,
    TypefaceModule,
  ],
  exports: [
    LayoutFooterComponent,
  ],
})
export class LayoutFooterModule { }

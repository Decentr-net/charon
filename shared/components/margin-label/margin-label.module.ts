import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { MarginLabelComponent } from './margin-label.component';
import { PositiveNumberModule } from '../../pipes/positiveNumber';

@NgModule({
  imports: [
    CommonModule,
    PositiveNumberModule,
    SvgIconsModule,
  ],
  declarations: [
    MarginLabelComponent,
  ],
  exports: [
    MarginLabelComponent,
  ],
})
export class MarginLabelModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { CheckboxComponent } from './checkbox.component';

@NgModule({
  declarations: [
    CheckboxComponent,
  ],
  exports: [
    CheckboxComponent,
  ],
  imports: [
    CommonModule,
    SvgIconsModule,
  ],
})
export class CheckboxModule {
}

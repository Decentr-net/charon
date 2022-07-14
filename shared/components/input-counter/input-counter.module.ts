import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { InputCounterComponent } from './input-counter.component';

@NgModule({
  declarations: [
    InputCounterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SvgIconsModule,
  ],
  exports: [
    InputCounterComponent,
  ],
})
export class InputCounterModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypefaceModule } from '../../directives/typeface';
import { InputContainerComponent } from './input-container.component';

@NgModule({
  declarations: [
    InputContainerComponent,
  ],
  exports: [
    InputContainerComponent,
  ],
  imports: [
    CommonModule,
    TypefaceModule,
  ],
})
export class InputContainerModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypefaceModule } from '../../directives/typeface';
import { InputContainerComponent } from './input-container.component';
import { FormErrorModule } from '../form-error';

@NgModule({
  declarations: [
    InputContainerComponent,
  ],
  exports: [
    InputContainerComponent,
    FormErrorModule,
  ],
  imports: [
    CommonModule,
    TypefaceModule,
  ],
})
export class InputContainerModule {
}

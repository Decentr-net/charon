import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CodeInputComponent } from './code-input.component';
import { TypefaceModule } from '../../directives/typeface';

@NgModule({
  declarations: [
    CodeInputComponent,
  ],
  imports: [
    TypefaceModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    CodeInputComponent,
  ],
})
export class CodeInputModule {
}

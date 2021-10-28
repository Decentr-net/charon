import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TranslocoModule } from '@ngneat/transloco';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

import { NumericModule } from '../../../directives/numeric';
import { TypefaceModule } from '../../../directives/typeface';
import { InputComponent } from './input.component';

@NgModule({
  declarations: [
    InputComponent,
  ],
  exports: [
    InputComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxTrimDirectiveModule,
    NumericModule,
    SvgIconsModule,
    TextFieldModule,
    TranslocoModule,
    TypefaceModule,
  ],
})
export class InputModule {
}

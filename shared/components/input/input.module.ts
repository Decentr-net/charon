import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TranslocoModule } from '@ngneat/transloco';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

import { TypefaceModule } from '../../directives/typeface';
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
    SvgIconsModule,
    TranslocoModule,
    TypefaceModule,
  ],
})
export class InputModule {
}

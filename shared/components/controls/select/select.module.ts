import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TranslocoModule } from '@ngneat/transloco';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

import { TypefaceModule } from '../../../directives/typeface';
import { SelectComponent } from './select.component';

@NgModule({
  declarations: [
    SelectComponent,
  ],
  exports: [
    SelectComponent,
  ],
  imports: [
    MatAutocompleteModule,
    CommonModule,
    FormsModule,
    NgxTrimDirectiveModule,
    SvgIconsModule,
    TextFieldModule,
    TranslocoModule,
    TypefaceModule,
  ],
})
export class SelectModule {
}

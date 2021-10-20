import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { ButtonModule } from '../button';
import { TextEditorComponent } from './text-editor.component';

@NgModule({
  declarations: [
    TextEditorComponent,
  ],
  imports: [
    ButtonModule,
    CommonModule,
    FormsModule,
    SvgIconsModule,
  ],
  exports: [
    TextEditorComponent,
  ],
})
export class TextEditorModule {
}

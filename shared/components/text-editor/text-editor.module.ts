import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { ButtonModule } from '../button';
import { TextEditorComponent } from './text-editor.component';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    SvgIconsModule,
  ],
  declarations: [
    TextEditorComponent,
  ],
  exports: [
    TextEditorComponent,
  ],
})
export class TextEditorModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SvgIconsModule } from '@ngneat/svg-icon';

import { AutomationModule } from '../../directives/automation';
import { ButtonModule } from '../button';
import { TextEditorComponent } from './text-editor.component';

@NgModule({
  declarations: [
    TextEditorComponent,
  ],
  imports: [
    AutomationModule,
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

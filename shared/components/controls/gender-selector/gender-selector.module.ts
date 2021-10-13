import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import { AutomationModule } from '../../../directives/automation';
import { TypefaceModule } from '../../../directives/typeface';
import { GenderSelectorComponent } from './gender-selector.component';

@NgModule({
  declarations: [
    GenderSelectorComponent,
  ],
  exports: [
    GenderSelectorComponent,
  ],
  imports: [
    AutomationModule,
    CommonModule,
    FormsModule,
    MatSelectModule,
    TypefaceModule,
  ],
})
export class GenderSelectorModule {
}

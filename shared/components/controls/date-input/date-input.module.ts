import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from '@ngneat/input-mask';

import { AutomationModule } from '../../../directives/automation';
import { TypefaceModule } from '../../../directives/typeface';
import { FormErrorModule } from '../../form-error';
import { DateInputComponent } from './date-input.component';

@NgModule({
  declarations: [
    DateInputComponent,
  ],
  imports: [
    AutomationModule,
    FormErrorModule,
    FormsModule,
    InputMaskModule,
    TypefaceModule,
  ],
  exports: [
    DateInputComponent,
  ],
})
export class DateInputModule {
}

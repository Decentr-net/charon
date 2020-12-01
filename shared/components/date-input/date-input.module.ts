import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FormErrorModule } from '../form-error';
import { DateInputComponent } from './date-input.component';

@NgModule({
  declarations: [
    DateInputComponent,
  ],
  imports: [
    FormErrorModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [
    DateInputComponent,
  ],
})
export class DateInputModule {
}

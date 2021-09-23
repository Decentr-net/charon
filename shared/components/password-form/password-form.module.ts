import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';

import { TypefaceModule } from '../../directives/typeface';
import { FormErrorModule } from '../form-error';
import { InputContainerModule } from '../input-container';
import { InputModule } from '../controls';
import { PasswordFormComponent } from './password-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormErrorModule,
    InputContainerModule,
    InputModule,
    ReactiveFormsModule,
    TranslocoModule,
    TypefaceModule,
  ],
  declarations: [
    PasswordFormComponent,
  ],
  exports: [
    PasswordFormComponent,
  ],
})
export class PasswordFormModule {
}

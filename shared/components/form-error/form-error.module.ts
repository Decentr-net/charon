import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

import { FormErrorComponent } from './form-error.component';

@NgModule({
  declarations: [
    FormErrorComponent,
  ],
  exports: [
    FormErrorComponent,
  ],
  imports: [
    CommonModule,
    TranslocoModule,
  ],
})
export class FormErrorModule { }

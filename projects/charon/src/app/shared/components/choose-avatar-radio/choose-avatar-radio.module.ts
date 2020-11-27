import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { NgModule } from '@angular/core';

import { AvatarModule } from '../../../../../../../shared/components/avatar';
import { ChooseAvatarRadioComponent } from './choose-avatar-radio.component';
import { FormErrorModule } from '../form-error';

@NgModule({
  declarations: [
    ChooseAvatarRadioComponent,
  ],
  imports: [
    AvatarModule,
    CommonModule,
    FormErrorModule,
    FormsModule,
    MatFormFieldModule,
    MatRadioModule,
  ],
  exports: [
    ChooseAvatarRadioComponent,
  ],
})
export class ChooseAvatarRadioModule {
}

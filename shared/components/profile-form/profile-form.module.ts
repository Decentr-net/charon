import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { TranslocoModule } from '@ngneat/transloco';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

import { ChooseAvatarRadioModule } from '../choose-avatar-radio';
import { DateInputModule } from '../date-input';
import { FormErrorModule } from '../form-error';
import { ProfileFormComponent } from './profile-form.component';
import { ProfileFormModel } from './profile-form-model';

@NgModule({
  imports: [
    ChooseAvatarRadioModule,
    CommonModule,
    DateInputModule,
    FormErrorModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    NgxTrimDirectiveModule,
    ReactiveFormsModule,
    TranslocoModule,
  ],
  declarations: [
    ProfileFormComponent,
  ],
  exports: [
    ProfileFormComponent,
  ],
  providers: [
    DatePipe,
    {
      provide: ProfileFormModel,
      useClass: ProfileFormModel,
    },
  ],
})
export class ProfileFormModule {
}

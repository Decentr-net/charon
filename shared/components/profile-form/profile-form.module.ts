import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';

import { TypefaceModule } from '../../directives/typeface';
import { AvatarSelectorModule, DateInputModule, GenderSelectorModule, InputModule } from '../controls';
import { FormErrorModule } from '../form-error';
import { InputContainerModule } from '../input-container';
import { ProfileFormComponent } from './profile-form.component';
import { ProfileFormModel } from './profile-form-model';

@NgModule({
  imports: [
    AvatarSelectorModule,
    CommonModule,
    DateInputModule,
    FormErrorModule,
    GenderSelectorModule,
    InputContainerModule,
    InputModule,
    ReactiveFormsModule,
    TranslocoModule,
    TypefaceModule,
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

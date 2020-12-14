import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

import { ChooseAvatarRadioModule } from '@shared/components/choose-avatar-radio';
import { CodeInputModule } from '@shared/components/code-input';
import { DateInputModule } from '@shared/components/date-input';
import { FormErrorModule } from '@shared/components/form-error';
import { ProfileFormModule } from '@shared/components/profile-form';
import { NavigationModule } from '@core/navigation';
import { SIGN_UP_COMPONENTS } from './components';
import { SIGN_UP_PAGES } from './pages';
import { SIGN_UP_SERVICES } from './services';
import { SignUpRoutingModule } from './sign-up-routing.module';

@NgModule({
  declarations: [
    SIGN_UP_COMPONENTS,
    SIGN_UP_PAGES,
  ],
  imports: [
    ChooseAvatarRadioModule,
    CodeInputModule,
    CommonModule,
    DateInputModule,
    FormsModule,
    FormErrorModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    NavigationModule,
    NgxTrimDirectiveModule,
    ProfileFormModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    SignUpRoutingModule,
    TranslocoModule,
  ],
  providers: [
    DatePipe,
    SIGN_UP_SERVICES,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: { scope: 'sign-up', alias: 'sign_up' },
    },
  ],
})
export class SignUpModule {
}

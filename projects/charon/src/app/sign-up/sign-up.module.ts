import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';

import { ButtonModule } from '@shared/components/button';
import { CodeInputModule } from '@shared/components/code-input';
import { FormErrorModule } from '@shared/components/form-error';
import { PdvTypesSettingsModule } from '@shared/components/pdv-types-settings';
import { ProfileFormModule } from '@shared/components/profile-form';
import { SIGN_UP_COMPONENTS } from './components';
import { SIGN_UP_PAGES } from './pages';
import { SIGN_UP_SERVICES } from './services';
import { SignUpRoutingModule } from './sign-up-routing.module';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TypefaceModule } from '@shared/directives/typeface';

@NgModule({
  declarations: [
    SIGN_UP_COMPONENTS,
    SIGN_UP_PAGES,
  ],
  imports: [
    ButtonModule,
    CodeInputModule,
    CommonModule,
    FormErrorModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    ProfileFormModule,
    PdvTypesSettingsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    SignUpRoutingModule,
    SvgIconsModule,
    TranslocoModule,
    TypefaceModule,
  ],
  providers: [
    SIGN_UP_SERVICES,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: { scope: 'sign-up', alias: 'sign_up' },
    },
  ],
})
export class SignUpModule {
}

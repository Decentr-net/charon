import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';

import { AutoFocusModule } from '@shared/directives/auto-focus';
import { TypefaceModule } from '@shared/directives/typeface';
import { ButtonModule } from '@shared/components/button';
import { FormErrorModule } from '@shared/components/form-error';
import { InputContainerModule } from '@shared/components/input-container';
import { InputModule } from '@shared/components/input';
import { LOGIN_PAGES } from './pages';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  declarations: [
    LOGIN_PAGES,
  ],
  imports: [
    AutoFocusModule,
    ButtonModule,
    CommonModule,
    FormErrorModule,
    InputContainerModule,
    InputModule,
    LoginRoutingModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    SvgIconsModule,
    TranslocoModule,
    TypefaceModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'login',
    },
  ],
})
export class LoginModule {
}

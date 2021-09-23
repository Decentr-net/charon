import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';

import { AutoFocusModule } from '@shared/directives/auto-focus';
import { BrowserViewModule } from '@shared/directives/browser-view';
import { SubmitSourceModule } from '@shared/directives/submit-source';
import { TypefaceModule } from '@shared/directives/typeface';
import { ButtonModule } from '@shared/components/button';
import { FormErrorModule } from '@shared/components/form-error';
import { InputContainerModule } from '@shared/components/input-container';
import { InputModule } from '@shared/components/controls/input';
import { LOGIN_PAGES } from './pages';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  declarations: [
    LOGIN_PAGES,
  ],
  imports: [
    AutoFocusModule,
    BrowserViewModule,
    ButtonModule,
    CommonModule,
    FormErrorModule,
    InputContainerModule,
    InputModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    SubmitSourceModule,
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

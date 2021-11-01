import { NgModule } from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { AvatarModule } from '@shared/components/avatar';
import { ButtonModule } from '@shared/components/button';
import { CheckboxModule } from '@shared/components/controls/checkbox';
import { CodeInputModule } from '@shared/components/code-input';
import { CurrencySymbolModule } from '@shared/components/currency-symbol';
import { FormErrorModule } from '@shared/components/form-error';
import { InputContainerModule } from '@shared/components/input-container';
import { InputModule } from '@shared/components/controls/input';
import { NumberFormatModule } from '@shared/pipes/number-format';
import { PasswordModule } from '@shared/components/password';
import { PdvTypesSettingsModule } from '@shared/components/pdv-types-settings';
import { ProfileFormModule } from '@shared/components/profile-form';
import { SubmitSourceModule } from '@shared/directives/submit-source';
import { TextEllipsisModule } from '@shared/directives/text-ellipsis';
import { TooltipModule } from '@shared/components/tooltip';
import { TypefaceModule } from '@shared/directives/typeface';
import { MicroValueModule } from '@shared/pipes/micro-value';
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
    AvatarModule,
    ButtonModule,
    CheckboxModule,
    ClipboardModule,
    CodeInputModule,
    CommonModule,
    CurrencySymbolModule,
    FormErrorModule,
    FormsModule,
    InputContainerModule,
    InputModule,
    MatButtonModule,
    MicroValueModule,
    NumberFormatModule,
    NgxSkeletonLoaderModule,
    PasswordModule,
    ProfileFormModule,
    PdvTypesSettingsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    SignUpRoutingModule,
    SubmitSourceModule,
    SvgIconsModule,
    TextEllipsisModule,
    TooltipModule,
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

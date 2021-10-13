import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ReactiveFormsModule } from '@angular/forms';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { AutomationModule } from '@shared/directives/automation';
import { AvatarModule } from '@shared/components/avatar';
import { ButtonModule } from '@shared/components/button';
import { ButtonBackModule } from '@shared/components/button-back';
import { ConfirmationDialogModule } from '@shared/components/confirmation-dialog';
import { CurrencySymbolModule } from '@shared/components/currency-symbol';
import { FormErrorModule } from '@shared/components/form-error';
import { InputContainerModule } from '@shared/components/input-container';
import { InputModule } from '@shared/components/controls';
import { MarginLabelModule } from '@shared/components/margin-label';
import { MicroValueModule } from '@shared/pipes/micro-value';
import { NetworkSelectorModule } from '@shared/components/network-selector';
import { NumberFormatModule } from '@shared/pipes/number-format';
import { PasswordModule } from '@shared/components/password';
import { PdvTypeIconModule } from '@shared/components/pdv-type-icon';
import { PdvTypesSettingsModule } from '@shared/components/pdv-types-settings';
import { ProfileFormModule } from '@shared/components/profile-form';
import { SlotModule } from '@shared/components/slot';
import { SubmitSourceModule } from '@shared/directives/submit-source';
import { TypefaceModule } from '@shared/directives/typeface';
import { NavigationModule } from '@core/navigation';
import { USER_PAGES } from './pages';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  imports: [
    AutomationModule,
    AvatarModule,
    ButtonModule,
    ButtonBackModule,
    ClipboardModule,
    CommonModule,
    ConfirmationDialogModule,
    CurrencySymbolModule,
    FormErrorModule,
    InputContainerModule,
    InputModule,
    MarginLabelModule,
    MicroValueModule,
    NavigationModule,
    NetworkSelectorModule,
    NgxSkeletonLoaderModule,
    NumberFormatModule,
    PasswordModule,
    PdvTypeIconModule,
    PdvTypesSettingsModule,
    ProfileFormModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    SlotModule,
    SubmitSourceModule,
    SvgIconsModule,
    TranslocoModule,
    TypefaceModule,
    UserRoutingModule,
  ],
  declarations: [
    USER_PAGES,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'user',
    },
  ],
})
export class UserModule {
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { QrCodeModule } from 'ng-qrcode';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';

import { AnalyticsModule } from '@shared/analytics';
import { AvatarModule } from '@shared/components/avatar';
import { ButtonModule } from '@shared/components/button';
import { ButtonBackModule } from '@shared/components/button-back';
import { ClipboardCopiedNotificationModule } from '@shared/directives/clipboard-copied-notification';
import { ConfirmationDialogModule } from '@shared/components/confirmation-dialog';
import { CurrencySymbolModule } from '@shared/components/currency-symbol';
import { FormErrorModule } from '@shared/components/form-error';
import { InputContainerModule } from '@shared/components/input-container';
import { InputModule } from '@shared/components/controls';
import { MarginLabelModule } from '@shared/components/margin-label';
import { MicroValueModule } from '@shared/pipes/micro-value';
import { NetworkSelectorModule } from '@shared/components/network-selector';
import { NumberFormatModule } from '@shared/pipes/number-format';
import { NumberSuffixModule } from '@shared/pipes/number-suffix';
import { PasswordModule } from '@shared/components/password';
import { PdvTypeIconModule } from '@shared/components/pdv-type-icon';
import { PdvTypesSettingsModule } from '@shared/components/pdv-types-settings';
import { ProfileFormModule } from '@shared/components/profile-form';
import { SeedModule } from '@shared/components/seed';
import { SlotModule } from '@shared/components/slot';
import { SubmitSourceModule } from '@shared/directives/submit-source';
import { ThemeModule } from '@shared/components/theme';
import { TooltipModule } from '@shared/components/tooltip';
import { TypefaceModule } from '@shared/directives/typeface';
import { NavigationModule } from '@core/navigation';
import { USER_COMPONENTS } from './components';
import { USER_PAGES } from './pages';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  imports: [
    AnalyticsModule,
    AvatarModule,
    ButtonModule,
    ButtonBackModule,
    ClipboardModule,
    ClipboardCopiedNotificationModule,
    CommonModule,
    ConfirmationDialogModule,
    CurrencySymbolModule,
    FormErrorModule,
    FormsModule,
    InputContainerModule,
    InputModule,
    MarginLabelModule,
    MatDialogModule,
    MatSelectModule,
    MicroValueModule,
    NavigationModule,
    NetworkSelectorModule,
    NgxSkeletonLoaderModule,
    NumberFormatModule,
    NumberSuffixModule,
    PasswordModule,
    PdvTypeIconModule,
    PdvTypesSettingsModule,
    ProfileFormModule,
    ReactiveFormsModule,
    QrCodeModule,
    RxReactiveFormsModule,
    SeedModule,
    SlotModule,
    SubmitSourceModule,
    SvgIconsModule,
    ThemeModule,
    TooltipModule,
    TranslocoModule,
    TypefaceModule,
    UserRoutingModule,
  ],
  declarations: [
    USER_COMPONENTS,
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

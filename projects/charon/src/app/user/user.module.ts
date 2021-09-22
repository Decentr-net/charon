import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ReactiveFormsModule } from '@angular/forms';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { AvatarModule } from '@shared/components/avatar';
import { ButtonModule } from '@shared/components/button';
import { ButtonBackModule } from '@shared/components/button-back';
import { ConfirmationDialogModule } from '@shared/components/confirmation-dialog';
import { FormErrorModule } from '@shared/components/form-error';
import { MarginLabelModule } from '@shared/components/margin-label';
import { MicroValueModule } from '@shared/pipes/micro-value';
import { NetworkSelectorModule } from '@shared/components/network-selector';
import { PasswordFormModule } from '@shared/components/password-form';
import { PdvTypeIconModule } from '@shared/components/pdv-type-icon';
import { PdvTypesSettingsModule } from '@shared/components/pdv-types-settings';
import { ProfileFormModule } from '@shared/components/profile-form';
import { SlotModule } from '@shared/components/slot';
import { TypefaceModule } from '@shared/directives/typeface';
import { NavigationModule } from '@core/navigation';
import { USER_PAGES } from './pages';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  imports: [
    AvatarModule,
    ButtonModule,
    ButtonBackModule,
    ClipboardModule,
    CommonModule,
    ConfirmationDialogModule,
    FormErrorModule,
    MarginLabelModule,
    MicroValueModule,
    NavigationModule,
    NetworkSelectorModule,
    NgxSkeletonLoaderModule,
    PasswordFormModule,
    PdvTypeIconModule,
    PdvTypesSettingsModule,
    ProfileFormModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    SlotModule,
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

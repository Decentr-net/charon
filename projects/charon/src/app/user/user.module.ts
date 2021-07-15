import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
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
import { PdvTypeIconModule } from '@shared/components/pdv-type-icon';
import { ProfileFormModule } from '@shared/components/profile-form';
import { SlotModule } from '@shared/components/slot';
import { TypefaceModule } from '@shared/directives/typeface';
import { NavigationModule } from '@core/navigation';
import { LayoutHeaderModule } from '../layout/layout-header';
import { USER_PAGES } from './pages';
import { USER_COMPONENTS } from './components';
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
    LayoutHeaderModule,
    MarginLabelModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MicroValueModule,
    NavigationModule,
    NetworkSelectorModule,
    NgxSkeletonLoaderModule,
    PdvTypeIconModule,
    ProfileFormModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    SlotModule,
    SvgIconsModule,
    TextFieldModule,
    TranslocoModule,
    TypefaceModule,
    UserRoutingModule,
  ],
  declarations: [
    USER_PAGES,
    USER_COMPONENTS,
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

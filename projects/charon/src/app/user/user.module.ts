import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { InlineSVGModule } from 'ng-inline-svg';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

import { ChooseAvatarRadioModule } from '@shared/components/choose-avatar-radio';
import { DateInputModule } from '@shared/components/date-input';
import { FormErrorModule } from '@shared/components/form-error';
import { ProfileFormModule } from '@shared/components/profile-form';
import { LayoutHeaderModule } from '../layout/layout-header';
import { USER_PAGES } from './pages';
import { USER_COMPONENTS } from './components';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  imports: [
    ChooseAvatarRadioModule,
    CommonModule,
    DateInputModule,
    FormErrorModule,
    InlineSVGModule,
    LayoutHeaderModule,
    MatExpansionModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatRadioModule,
    MatTabsModule,
    MatTooltipModule,
    NgxTrimDirectiveModule,
    ProfileFormModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    TranslocoModule,
    UserRoutingModule,
  ],
  declarations: [
    USER_PAGES,
    USER_COMPONENTS,
  ],
  providers: [
    DatePipe,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'user',
    },
  ],
})
export class UserModule {
}

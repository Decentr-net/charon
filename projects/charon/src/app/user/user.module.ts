import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';

import { FormErrorModule } from '@shared/components/form-error';
import { ProfileFormModule } from '@shared/components/profile-form';
import { MatButtonModule } from '@angular/material/button';
import { NavigationModule } from '@core/navigation';
import { LayoutHeaderModule } from '../layout/layout-header';
import { USER_PAGES } from './pages';
import { USER_COMPONENTS } from './components';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormErrorModule,
    LayoutHeaderModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    NavigationModule,
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
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'user',
    },
  ],
})
export class UserModule {
}

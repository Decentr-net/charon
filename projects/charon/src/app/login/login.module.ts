import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';

import { FormErrorModule } from '@shared/components/form-error';
import { NavigationModule } from '@core/navigation';
import { LOGIN_PAGES } from './pages';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  declarations: [
    LOGIN_PAGES,
  ],
  imports: [
    CommonModule,
    FormErrorModule,
    LoginRoutingModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    NavigationModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    TranslocoModule,
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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { LOAN_PAGES } from './pages';
import { LoanRoutingModule } from './loan-routing.module,';
import { ProfileFormModule } from '@shared/components/profile-form';
import { FormErrorModule } from '@shared/components/form-error';
import { ReactiveFormsModule } from '@angular/forms';
import { SubmitSourceModule } from '@shared/directives/submit-source';
import { TypefaceModule } from '@shared/directives/typeface';
import { ButtonModule } from '@shared/components/button';
import { LOAN_COMPONENTS } from './components';
import { InputContainerModule } from '@shared/components/input-container';
import { InputModule } from '@shared/components/controls';

@NgModule({
  declarations: [
    LOAN_COMPONENTS,
    LOAN_PAGES,
  ],
  imports: [
    CommonModule,
    FormErrorModule,
    LoanRoutingModule,
    ProfileFormModule,
    TranslocoModule,
    ReactiveFormsModule,
    SubmitSourceModule,
    TypefaceModule,
    ButtonModule,
    InputContainerModule,
    InputModule,
    TranslocoModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'loan',
    },
  ],
})
export class LoanModule {
}

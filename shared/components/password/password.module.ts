import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TranslocoModule } from '@ngneat/transloco';

import { TypefaceModule } from '../../directives/typeface';
import { FormErrorModule } from '../form-error';
import { InputContainerModule } from '../input-container';
import { InputModule } from '../controls';
import { PasswordFormComponent } from './password-form';
import { PasswordValidationStateComponent } from './password-validation-state';
import { ErrorProcessor } from '../../services/notification';
import { PasswordValidationConfig } from './validation';

export interface PasswordModuleConfig {
  validation: PasswordValidationConfig;
}

export const PASSWORD_VALIDATION_CONFIG: InjectionToken<ErrorProcessor>
  = new InjectionToken('PASSWORD_VALIDATION_CONFIG');

@NgModule({
  imports: [
    CommonModule,
    FormErrorModule,
    InputContainerModule,
    InputModule,
    ReactiveFormsModule,
    SvgIconsModule,
    TranslocoModule,
    TypefaceModule,
  ],
  declarations: [
    PasswordFormComponent,
    PasswordValidationStateComponent,
  ],
  exports: [
    PasswordFormComponent,
    PasswordValidationStateComponent,
  ],
})
export class PasswordModule {
  public static forRoot(config: PasswordModuleConfig): ModuleWithProviders<PasswordModule> {
    return {
      ngModule: PasswordModule,
      providers: [
        {
          provide: PASSWORD_VALIDATION_CONFIG,
          useValue: config.validation,
        },
      ],
    };
  }
}

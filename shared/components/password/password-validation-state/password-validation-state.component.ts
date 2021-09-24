import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgCheck } from '../../../svg-icons/check';
import { svgClosed } from '../../../svg-icons/closed';
import { CustomPasswordValidation, PASSWORD_VALIDATION, PasswordTranslationsConfig } from '../password.definitions';

type PasswordValidationState = Record<keyof CustomPasswordValidation, boolean>;

@Component({
  selector: 'app-password-validation-state',
  styleUrls: ['./password-validation-state.component.scss'],
  templateUrl: './password-validation-state.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordValidationStateComponent implements OnInit {
  @Input() public translationsConfig: PasswordTranslationsConfig;

  @Input() public set password(value: string) {
    this.state = PasswordValidationStateComponent.getPasswordState(value, PASSWORD_VALIDATION);
  }

  public minLength = PASSWORD_VALIDATION.minLength;

  public state: PasswordValidationState;

  constructor(
    private svgIconRegistry: SvgIconRegistry,
  ) {
  }

  private static getPasswordState(
    password: string,
    validationConfig: CustomPasswordValidation,
  ): PasswordValidationState {
    const minLength = password?.length >= validationConfig.minLength;

    const digit = !!password?.match(/[0-9]/);

    const lowerCase = !!password?.match(/[a-z]/);

    const upperCase = !!password?.match(/[A-Z]/);

    const specialCharacter = !!password?.match(/[^A-Za-z0-9]/);

    return {
      minLength,
      digit,
      lowerCase,
      upperCase,
      specialCharacter,
    };
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgCheck,
      svgClosed,
    ]);
  }
}

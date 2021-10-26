import { ValidatorFn } from '@angular/forms';

export interface PasswordValidationConfig {
  minlength: number;
  digit: boolean;
  lowerCase: boolean;
  upperCase: boolean;
  specialCharacter: boolean;
}

export type PasswordValidationState = Record<keyof PasswordValidationConfig, boolean>;

export const getPasswordState = (password: string, config: PasswordValidationConfig): PasswordValidationState => {
  const minlength = password?.length >= config.minlength;

  const digit = !config.digit || !!password?.match(/[0-9]/);

  const lowerCase = !config.lowerCase || !!password?.match(/[a-z]/);

  const upperCase = !config.upperCase || !!password?.match(/[A-Z]/);

  const specialCharacter = !config.specialCharacter || !!password?.match(/[!`=+\-_~;'@#$%^&*(),.?":{}|<>\s]/);

  return {
    minlength,
    digit,
    lowerCase,
    upperCase,
    specialCharacter,
  };
};

export const passwordValidator = (config: PasswordValidationConfig): ValidatorFn => {
  return (control) => {
    if (!control.value) {
      return null;
    }

    const state = getPasswordState(control.value, config);

    return Object.values(state).some((value) => !value) ? { password: true } : null;
  };
};

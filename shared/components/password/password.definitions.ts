import { PasswordValidation } from '@rxweb/reactive-form-validators/models';

export interface PasswordTranslationsConfig {
  read: string;
  scope?: string;
}

export type CustomPasswordValidation = Required<
  Pick<
    PasswordValidation,
    'digit' | 'lowerCase' | 'upperCase' | 'specialCharacter' | 'minLength'
  >
>;

export const PASSWORD_VALIDATION: CustomPasswordValidation = {
  digit: true,
  lowerCase: true,
  upperCase: true,
  specialCharacter: true,
  minLength: 8,
};

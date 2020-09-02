import { AbstractControl, FormGroup } from '@angular/forms';
import { ControlValidation } from '../../models/validation/control-validation.model';

export abstract class BaseSingleFormGroupComponent {
  form: FormGroup;

  submissionInfo = {
    submitAttempt: false,
  };

  getActivateErrorKey(control: AbstractControl, validations: ControlValidation[]): string {
    if (control) {
      for (const validation of validations) {
        if (control.hasError(validation.errorCode)) {
          return validation.validationKeyPart;
        }
      }
    }

    return null;
  }
}

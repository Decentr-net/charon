import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BaseSingleFormGroupComponent } from '../../../shared/components/base-single-form-group/base-single-form-group.component';
import { AbstractControl, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { PasswordValidationUtil } from '../../../shared/utils/validation/password/password-validation.util';
import { BaseValidationUtil, formError } from '../../../shared/utils/validation/base/base-validation.util';
import { NavigationService } from '../../../shared/services/navigation/navigation.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAccountComponent extends BaseSingleFormGroupComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
              private navigationService: NavigationService) {
    super();

    this.form = formBuilder.group({
      gender: [null, [Validators.required]],
      birthday: ['', [Validators.required, BaseValidationUtil.isUsDateFormatCorrect]],
      email: formBuilder.array([]),
      name: formBuilder.array([]),
      password: [null, [
        Validators.required,
        Validators.minLength(8),
        PasswordValidationUtil.validatePasswordStrength
      ]],
      confirmPassword: [null, PasswordValidationUtil.equalsToAdjacentControl('password')],
      agreeTerms: [null, [Validators.requiredTrue]]
    });
  }

  ngOnInit() {
    this.addFormControl('email');
    this.addFormControl('name');
  }

  navigateBack() {
    this.navigationService.getPreviousUrl();
  }

  onSubmit() {
    this.submissionInfo.submitAttempt = true;

    if (!this.form.valid) {
      throw formError(this.form);
    }

    // TODO: add service
  }

  onKeyDateInput(event) {
    if (event.inputType !== 'deleteContentBackward') {
      const control = this.form.controls['birthday'];
      let outputValue = control.value.replace(/\D/g, '');

      if (outputValue.length > 1 && outputValue.length < 4) {
        outputValue = `${outputValue.substring(0, 2)}/${outputValue.substring(2, 3)}`;
      } else if (outputValue.length >= 4) {
        outputValue = `${outputValue.substring(0, 2)}/${outputValue.substring(2, 4)}/${outputValue.substring(4, outputValue.length)}`;
        outputValue = outputValue.substring(0, 10);
      }

      control.setValue(outputValue);
    }
  }

  invalid(control: AbstractControl) {
    return control && !control.valid && (control.dirty || this.submissionInfo.submitAttempt);
  }

  get genderControl(): FormControl {
    return this.form.get('gender') as FormControl;
  }

  get birthdayControl(): FormControl {
    return this.form.get('birthday') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get confirmPasswordControl(): FormControl {
    return this.form.get('confirmPassword') as FormControl;
  }

  addFormControl(type: string) {
    const formArray = this.form.controls[type] as FormArray;
    const formControl = new FormControl(null);

    if (type === 'email') {
      formControl.setValidators([Validators.required, Validators.email]);
    }

    if (type === 'name') {
      formControl.setValidators([Validators.required, Validators.minLength(3)]);
    }

    formArray.push(formControl);
  }

  removeFormControl(type: string, index: number) {
    const formArray = this.form.controls[type] as FormArray;

    formArray.removeAt(index);
  }
}

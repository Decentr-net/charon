import { Component, OnInit } from '@angular/core';
import { BaseSingleFormGroupComponent } from '../../../shared/components/base-single-form-group/base-single-form-group.component';
import { AbstractControl, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { PasswordValidationUtil } from '../../../shared/utils/validation/password/password-validation.util';
import { formError } from '../../../shared/utils/validation/base/base-validation.util';
import { NavigationService } from '../../../shared/services/navigation/navigation.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent extends BaseSingleFormGroupComponent implements OnInit {

  maxDate: Date;

  constructor(private formBuilder: FormBuilder,
              private navigationService: NavigationService) {
    super();

    this.maxDate = new Date();

    this.form = formBuilder.group({
      gender: [null, [Validators.required]],
      birthday: [null, [Validators.required]],
      email: formBuilder.array([]),
      name: formBuilder.array([]),
      password: [null, [
        Validators.required,
        Validators.minLength(8),
        PasswordValidationUtil.validatePasswordStrength
      ]],
      confirmPassword: null,
      agreeTerms: [null, [Validators.requiredTrue]]
    }, {
      validators: PasswordValidationUtil.validatePasswordsMatches
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

    formArray.removeAt(index)
  }
}

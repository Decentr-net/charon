import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseSingleFormGroupComponent } from '../../../shared/components/base-single-form-group/base-single-form-group.component';
import { AbstractControl, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NavigationService } from '../../../shared/services/navigation/navigation.service';
import { BaseValidationUtil, formError, PasswordValidationUtil } from '../../../shared/utils/validation';
import { SignUpService } from '../../services';
import { SignUpRoute } from '../../sign-up-route';
import { Gender } from '../../../shared/services/user-api';

@Component({
  selector: 'app-account-form-page',
  templateUrl: './account-form-page.component.html',
  styleUrls: ['./account-form-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountFormPageComponent extends BaseSingleFormGroupComponent implements OnInit {
  public gender: typeof Gender = Gender;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private navigationService: NavigationService,
    private signUpService: SignUpService,
    private router: Router,
  ) {
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

    const { gender, birthDate, email: emails, name: usernames, password } = this.form.getRawValue();
    this.signUpService.setUserData({
      gender,
      birthDate,
      emails,
      usernames,
      password,
    });
    this.router.navigate(['../', SignUpRoute.SeedPhrase], {
      relativeTo: this.activatedRoute,
    });
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

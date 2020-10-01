import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { FormArray, FormBuilder, FormGroup } from '@ngneat/reactive-forms';

import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { NavigationService } from '@shared/services/navigation/navigation.service';
import { Gender } from '@shared/services/user';
import { BaseValidationUtil, PasswordValidationUtil } from '@shared/utils/validation';
import { SignUpService } from '../../services';
import { SignUpRoute } from '../../sign-up-route';

interface AccountForm {
  agreeTerms: boolean;
  birthdate: string;
  confirmPassword: string;
  gender: Gender;
  email: string[];
  name: string[];
  password: string;
}

@Component({
  selector: 'app-account-form-page',
  templateUrl: './account-form-page.component.html',
  styleUrls: ['./account-form-page.component.scss'],
  providers: [
    {
      provide: FORM_ERROR_TRANSLOCO_READ,
      useValue: 'sign_up.account_form_page.form',
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountFormPageComponent implements OnInit {
  public gender: typeof Gender = Gender;
  public form: FormGroup<AccountForm>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private navigationService: NavigationService,
    private signUpService: SignUpService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.form = this.createForm();
    this.addEmail();
    this.addUsername();
  }

  navigateBack() {
    this.navigationService.getPreviousUrl();
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    const { gender, birthdate, email: emails, name: usernames, password } = this.form.getRawValue();
    this.signUpService.setUserData({
      gender,
      birthdate,
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
      const control = this.form.getControl('birthdate');
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

  public get emailFormArray(): FormArray<string> {
    return this.form.controls.email as FormArray;
  }

  public get usernameFormArray(): FormArray<string> {
    return this.form.controls.name as FormArray;
  }

  public addEmail(): void {
    this.emailFormArray.push(this.formBuilder.control('', [
      Validators.required,
      Validators.email,
    ]));
  }

  public addUsername(): void {
    this.usernameFormArray.push(this.formBuilder.control('', [
      Validators.required,
      Validators.minLength(3),
    ]));
  }

  public removeEmail(index: number): void {
    const emailFormArray = this.form.controls.email as FormArray;
    emailFormArray.removeAt(index);
  }

  public removeUsername(index: number): void {
    const usernameFormArray = this.form.controls.email as FormArray;
    usernameFormArray.removeAt(index);
  }

  private createForm(): FormGroup<AccountForm> {
    return this.formBuilder.group({
      agreeTerms: [false, [
        Validators.requiredTrue,
      ]],
      birthdate: ['', [
        Validators.required,
        BaseValidationUtil.isUsDateFormatCorrect,
      ]],
      confirmPassword: ['', [
        PasswordValidationUtil.equalsToAdjacentControl('password'),
      ]],
      gender: [null, [
        Validators.required,
      ]],
      email: this.formBuilder.array([]),
      name: this.formBuilder.array([]),
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        PasswordValidationUtil.validatePasswordStrength,
      ]],
    });
  }
}

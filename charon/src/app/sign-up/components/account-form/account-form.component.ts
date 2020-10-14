import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormArray, FormBuilder, FormGroup } from '@ngneat/reactive-forms';

import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { Gender } from '@shared/services/user';
import { BaseValidationUtil, PasswordValidationUtil } from '@shared/utils/validation';

export interface AccountData {
  birthday: string;
  gender: Gender;
  emails: string[];
  usernames: string[];
  password: string;
}

interface AccountForm extends AccountData {
  agreeTerms: boolean;
  confirmPassword: string;
}

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss'],
  providers: [
    {
      provide: FORM_ERROR_TRANSLOCO_READ,
      useValue: 'sign_up.account_form_page.form',
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountFormComponent implements OnInit {
  @Output() public submitted: EventEmitter<AccountData> = new EventEmitter();

  public gender: typeof Gender = Gender;
  public form: FormGroup<AccountForm>;

  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.form = this.createForm();
    this.addEmail();
    this.addUsername();
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    this.submitted.emit(this.form.getRawValue());
  }

  public get emailFormArray(): FormArray<string> {
    return this.form.controls.emails as FormArray;
  }

  public get usernameFormArray(): FormArray<string> {
    return this.form.controls.usernames as FormArray;
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
    const emailFormArray = this.form.controls.emails as FormArray;
    emailFormArray.removeAt(index);
  }

  public removeUsername(index: number): void {
    const usernameFormArray = this.form.controls.usernames as FormArray;
    usernameFormArray.removeAt(index);
  }

  private createForm(): FormGroup<AccountForm> {
    return this.formBuilder.group({
      agreeTerms: [false, [
        Validators.requiredTrue,
      ]],
      birthday: ['', [
        Validators.required,
        BaseValidationUtil.isFrDateFormatCorrect,
      ]],
      confirmPassword: ['', [
        Validators.required,
        PasswordValidationUtil.equalsToAdjacentControl('password'),
      ]],
      gender: [null, [
        Validators.required,
      ]],
      emails: this.formBuilder.array([]),
      usernames: this.formBuilder.array([]),
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        PasswordValidationUtil.validatePasswordStrength,
      ]],
    });
  }
}

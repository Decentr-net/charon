import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';

import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { PasswordValidationUtil } from '@shared/utils/validation';

export interface BaseAccountData {
  email: string;
  password: string;
}

interface BaseAccountForm extends BaseAccountData {
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
  @Output() public submitted: EventEmitter<BaseAccountData> = new EventEmitter();

  public form: FormGroup<BaseAccountForm>;

  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.form = this.createForm();
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    this.submitted.emit(this.form.getRawValue());
  }

  private createForm(): FormGroup<BaseAccountForm> {
    return this.formBuilder.group({
      agreeTerms: [false, [
        Validators.requiredTrue,
      ]],
      confirmPassword: ['', [
        Validators.required,
        PasswordValidationUtil.equalsToAdjacentControl('password'),
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        PasswordValidationUtil.validatePasswordStrength,
      ]],
    });
  }
}

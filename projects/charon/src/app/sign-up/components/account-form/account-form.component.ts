import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { AbstractControl, FormBuilder, FormGroup } from '@ngneat/reactive-forms';

import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';

export interface AccountData {
  email: string;
  password: string;
}

interface AccountForm extends AccountData {
  agreeTerms: boolean;
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
  @Output() public back: EventEmitter<AccountData> = new EventEmitter();
  @Output() public submitted: EventEmitter<AccountData> = new EventEmitter();

  public form: FormGroup<AccountForm>;

  public formId = 'SIGN_UP_ACCOUNT_FORM';

  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  public get passwordControl(): AbstractControl<string> {
    return this.form.get('password');
  }

  ngOnInit(): void {
    this.form = this.createForm();
  }

  public onBack(): void {
    this.back.emit();
  }

  onSubmit(): void {
    if (!this.form.valid) {
      return;
    }

    this.submitted.emit(this.form.getRawValue());
  }

  private createForm(): FormGroup<AccountForm> {
    return this.formBuilder.group({
      agreeTerms: [false, [
        Validators.requiredTrue,
      ]],
      email: ['', [
        Validators.required,
        RxwebValidators.email(),
      ]],
      password: [''],
    });
  }
}

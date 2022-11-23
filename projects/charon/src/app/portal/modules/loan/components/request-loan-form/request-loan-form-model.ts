import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import {
  FormGroupType,
  LoanPersonalInfoForm,
  RequestLoanFormControlName, RequestLoanFormControlValue,
} from './request-loan-form.definitions';

@Injectable()
export class RequestLoanFormModel {
  public createForm(): FormGroupType {
    const form = new FormGroup({}) as FormGroupType;

    const firstNameControl = this.createFirstNameControl();
    if (firstNameControl) {
      form.addControl(RequestLoanFormControlName.FirstName, firstNameControl);
    }

    const lastNameControl = this.createLastNameControl();
    if (lastNameControl) {
      form.addControl(RequestLoanFormControlName.LastName, lastNameControl);
    }

    const walletAddressControl = this.createWalletAddressControl();
    if (walletAddressControl) {
      form.addControl(RequestLoanFormControlName.WalletAddress, walletAddressControl);
    }

    const pdvRateControl = this.createPDVControl();
    if (pdvRateControl) {
      form.addControl(RequestLoanFormControlName.PdvRate, pdvRateControl);
    }

    return form;
  }

  public patchForm(
    form: FormGroupType,
    value: RequestLoanFormControlValue,
    options?: { emitEvent: boolean },
  ): void {
    const patch: LoanPersonalInfoForm = {
      ...value,
    };

    form.patchValue(patch, options);
  }

  public getOuterValue(form: FormGroupType): RequestLoanFormControlValue {
    const formValue = form.getRawValue();
    return { ...formValue };
  }

  protected createFirstNameControl(): FormControl<LoanPersonalInfoForm['firstName']> {
    return new FormControl(
      '',
      [
        Validators.required,
      ],
    );
  }

  protected createLastNameControl(): FormControl<LoanPersonalInfoForm['lastName']> {
    return new FormControl(
      '',
      [],
    );
  }

  protected createWalletAddressControl(): FormControl<LoanPersonalInfoForm['walletAddress']> {
    return new FormControl(
      { value: '', disabled: true },
      [],
    );
  }

  protected createPDVControl(): FormControl<LoanPersonalInfoForm['pdvRate']> {
    return new FormControl(
      { value: null, disabled: true },
      [],
    );
  }

}

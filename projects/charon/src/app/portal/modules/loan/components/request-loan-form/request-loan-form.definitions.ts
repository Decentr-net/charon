import { ControlsOf, FormGroup } from '@ngneat/reactive-forms';

export enum RequestLoanFormControlName {
  FirstName = 'firstName',
  LastName = 'lastName',
  PdvRate = 'pdvRate',
  WalletAddress = 'walletAddress',
}

export interface LoanPersonalInfoForm {
  firstName: string,
  lastName: string,
  pdvRate: number,
  walletAddress: string,
}

export type RequestLoanFormControlValue = Pick<LoanPersonalInfoForm, 'firstName' | 'lastName' | 'walletAddress' | 'pdvRate'>;

export type FormGroupType = FormGroup<ControlsOf<LoanPersonalInfoForm>>;

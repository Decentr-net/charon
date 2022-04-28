import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { Observable } from 'rxjs';
import { ControlValueAccessor, FormArray, FormControl } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { ProfileFormModel } from './profile-form-model';
import {
  ArrayControlName,
  EmailForm,
  FormGroupType,
  ProfileFormControlName,
  ProfileFormControlValue,
  TranslationsConfig,
} from './profile-form.definitions';
import { GenderSelectorTranslations } from '../controls';

@UntilDestroy()
@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ProfileFormComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: ProfileFormComponent,
      multi: true,
    },
  ],
})
export class ProfileFormComponent extends ControlValueAccessor<ProfileFormControlValue> implements OnInit, Validator {
  @Input() public translationsConfig: TranslationsConfig;

  public readonly form: FormGroupType;

  public readonly maxAdditionalEmailsCount: number = 9;

  public readonly controlName: typeof ProfileFormControlName = ProfileFormControlName;

  public genderTranslations$: Observable<GenderSelectorTranslations & { placeholder: string }>;

  constructor(
    private formModel: ProfileFormModel,
    private translocoService: TranslocoService,
  ) {
    super();

    this.form = formModel.createForm();
  }

  public get emailFormArray(): FormArray<EmailForm> {
    return this.formModel.getEmailsFormArray(this.form);
  }

  public get primaryEmailControl(): FormControl<string> {
    return this.emailFormArray.get([0, ProfileFormControlName.EmailValue]) as FormControl<string>;
  }

  public ngOnInit(): void {
    this.form.valueChanges
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(() => this.onChange(this.getOuterValue()));

    this.genderTranslations$ = this.translocoService
      .selectTranslateObject(`${this.translationsConfig.read}.gender`);
  }

  public isArrayControlsLimitExceeded(arrayName: ArrayControlName): boolean {
    switch (arrayName) {
      case ProfileFormControlName.Emails:
        return this.emailFormArray.length >= this.maxAdditionalEmailsCount;
      default:
        return false;
    }
  }

  public addArrayControl(arrayName: ArrayControlName): void {
    switch (arrayName) {
      case ProfileFormControlName.Emails:
        return this.formModel.addEmail(this.form);
    }
  }

  public removeArrayControl(arrayName: ArrayControlName, index: number): void {
    switch (arrayName) {
      case ProfileFormControlName.Emails:
        return this.formModel.removeEmail(this.form, index);
    }
  }

  public getArrayControl(arrayName: ArrayControlName): FormArray<EmailForm> {
    switch (arrayName) {
      case ProfileFormControlName.Emails:
        return this.formModel.getEmailsFormArray(this.form);
      default:
        return undefined;
    }
  }

  public validate(): ValidationErrors | null {
    if (this.form.invalid) {
      return {
        invalid: true,
      };
    }

    return null;
  }

  public writeValue(value: ProfileFormControlValue): void {
    this.formModel.patchForm(this.form, value, { emitEvent: true });
  }

  private getOuterValue(): ProfileFormControlValue {
    return this.formModel.getOuterValue(this.form);
  }
}

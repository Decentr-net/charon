import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { BaseSingleFormGroupComponent } from '../../../shared/components/base-single-form-group/base-single-form-group.component';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { PasswordValidationUtil } from '../../../shared/utils/validation/password/password-validation.util';
import { BaseValidationUtil } from '../../../shared/utils/validation/base/base-validation.util';
import { NavigationService } from '../../../shared/services/navigation/navigation.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

export enum PageType {
  IMPORT_ACCOUNT = 'import-account',
  RESTORE_ACCOUNT = 'restore-account'
}

@Component({
  selector: 'app-import-account-seed-phrase',
  templateUrl: './import-account-seed-phrase.component.html',
  styleUrls: ['./import-account-seed-phrase.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportAccountSeedPhraseComponent extends BaseSingleFormGroupComponent implements OnInit, OnDestroy {

  isSeedPhraseVisible = false;
  pageType: string;

  _routeData$: Subscription;

  constructor(formBuilder: FormBuilder,
              private navigationService: NavigationService,
              private route: ActivatedRoute) {
    super();

    this.form = formBuilder.group({
      seedPhrase: [null, [Validators.required, BaseValidationUtil.isSeedPhraseCorrect]],
      password: [null, [
        Validators.required,
        Validators.minLength(8),
        PasswordValidationUtil.validatePasswordStrength
      ]],
      confirmPassword: [null, PasswordValidationUtil.equalsToAdjacentControl('password')],
    });
  }

  ngOnInit() {
    this._routeData$ = this.route.data.subscribe(res => {
      this.pageType = res.pageType;
    });
  }

  ngOnDestroy() {
    this._routeData$.unsubscribe();
  }

  navigateBack() {
    this.navigationService.getPreviousUrl();
  }

  onSubmit() {
    // TODO: add service
    if (this.pageType === PageType.IMPORT_ACCOUNT) {
      console.log('submit import account');
    }

    if (this.pageType === PageType.RESTORE_ACCOUNT) {
      console.log('submit restore account');
    }
  }

  toggleSeedPhraseVisibility() {
    this.isSeedPhraseVisible = !this.isSeedPhraseVisible;
  }

  get seedPhraseControl(): FormControl {
    return this.form.get('seedPhrase') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get confirmPasswordControl(): FormControl {
    return this.form.get('confirmPassword') as FormControl;
  }

  get PageType() {
    return PageType;
  }
}

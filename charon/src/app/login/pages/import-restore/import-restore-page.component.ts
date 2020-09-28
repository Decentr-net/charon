import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck, share } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { BaseSingleFormGroupComponent } from '../../../shared/components/base-single-form-group/base-single-form-group.component';
import { FORM_ERROR_TRANSLOCO_READ } from '../../../shared/components/form-error';
import { BaseValidationUtil, PasswordValidationUtil } from '../../../shared/utils/validation';
import { NavigationService } from '../../../shared/services/navigation/navigation.service';
import { ImportRestorePageService } from './import-restore-page.service';

export enum ImportRestorePageType {
  IMPORT_ACCOUNT = 'import-account',
  RESTORE_ACCOUNT = 'restore-account'
}

@UntilDestroy()
@Component({
  selector: 'app-import-account-seed-phrase',
  templateUrl: './import-restore-page.component.html',
  styleUrls: ['./import-restore-page.component.scss'],
  providers: [
    ImportRestorePageService,
    {
      provide: FORM_ERROR_TRANSLOCO_READ,
      useValue: 'login.import_restore_page.form',
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportRestorePageComponent extends BaseSingleFormGroupComponent implements OnInit {
  public pageType: typeof ImportRestorePageType = ImportRestorePageType;
  isSeedPhraseVisible = false;
  public currentPageType$: Observable<ImportRestorePageType>;

  constructor(
    formBuilder: FormBuilder,
    private navigationService: NavigationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private pageService: ImportRestorePageService,
  ) {
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
    this.currentPageType$ = this.activatedRoute.data.pipe(
      pluck('pageType'),
      share(),
      untilDestroyed(this),
    );
  }

  navigateBack() {
    this.navigationService.getPreviousUrl();
  }

  onSubmit(pageType: ImportRestorePageType) {
    const { seedPhrase, password } = this.form.getRawValue();
    if (pageType === ImportRestorePageType.IMPORT_ACCOUNT) {
      this.pageService.importUser(seedPhrase, password).pipe(
        untilDestroyed(this),
      ).subscribe()
    }

    if (pageType === ImportRestorePageType.RESTORE_ACCOUNT) {
      this.pageService.restoreUser(seedPhrase, password).pipe(
        untilDestroyed(this),
      ).subscribe()
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
}

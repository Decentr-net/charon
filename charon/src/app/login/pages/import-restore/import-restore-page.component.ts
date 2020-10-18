import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck, share } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';

import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { BaseValidationUtil, PasswordValidationUtil } from '@shared/utils/validation';
import { NavigationService } from '@shared/services/navigation/navigation.service';
import { ImportRestorePageService } from './import-restore-page.service';

export enum ImportRestorePageType {
  IMPORT_ACCOUNT = 'import-account',
  RESTORE_ACCOUNT = 'restore-account',
}

interface ImportRestoreForm {
  confirmPassword: string;
  password: string;
  seedPhrase: string;
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
export class ImportRestorePageComponent implements OnInit {
  public pageType: typeof ImportRestorePageType = ImportRestorePageType;
  isSeedPhraseVisible = false;
  public currentPageType$: Observable<ImportRestorePageType>;
  public form: FormGroup<ImportRestoreForm>;

  constructor(
    private formBuilder: FormBuilder,
    private navigationService: NavigationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private pageService: ImportRestorePageService,
  ) {
  }

  ngOnInit() {
    this.form = this.createForm();

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

  private createForm(): FormGroup<ImportRestoreForm> {
    return this.formBuilder.group({
      confirmPassword: ['', [
        Validators.required,
        PasswordValidationUtil.equalsToAdjacentControl('password'),
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        PasswordValidationUtil.validatePasswordStrength,
      ]],
      seedPhrase: ['', [
        Validators.required,
        BaseValidationUtil.isSeedPhraseCorrect,
      ]],
    });
  }
}

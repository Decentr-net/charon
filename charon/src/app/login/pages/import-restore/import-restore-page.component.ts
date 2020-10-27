import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, pluck, share } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';

import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { BaseValidationUtil, PasswordValidationUtil } from '@shared/utils/validation';
import { NavigationService } from '@shared/services/navigation/navigation.service';
import { ImportRestorePageService } from './import-restore-page.service';
import { SpinnerService } from '@shared/services/spinner/spinner.service';
import { TranslocoService } from '@ngneat/transloco';
import { ToastrService } from 'ngx-toastr';

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
    private spinnerService: SpinnerService,
    private toastrService: ToastrService,
    private translocoService: TranslocoService,
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
    this.spinnerService.showSpinner();

    const { seedPhrase, password } = this.form.getRawValue();
    if (pageType === ImportRestorePageType.IMPORT_ACCOUNT) {
      this.pageService.importUser(seedPhrase, password).pipe(
        finalize(() => this.spinnerService.hideSpinner()),
        catchError(error => {
          this.toastrService.error(this.translocoService.translate('toastr.errors.unknown_error'));
          return throwError(error);
        }),
        untilDestroyed(this),
      ).subscribe()
    }

    if (pageType === ImportRestorePageType.RESTORE_ACCOUNT) {
      this.pageService.restoreUser(seedPhrase, password).pipe(
        catchError(error => {
          this.toastrService.error(this.translocoService.translate('toastr.errors.unknown_error'));
          return throwError(error);
        }),
        finalize(() => this.spinnerService.hideSpinner()),
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

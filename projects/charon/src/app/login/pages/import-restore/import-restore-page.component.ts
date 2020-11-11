import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { noop, Observable } from 'rxjs';
import { finalize, pluck, share } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { BaseValidationUtil, PasswordValidationUtil } from '@shared/utils/validation';
import { SpinnerService } from '@core/spinner';
import { NotificationService } from '@core/services';
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

  public isSeedPhraseVisible = false;

  public currentPageType$: Observable<ImportRestorePageType>;

  public form: FormGroup<ImportRestoreForm>;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private spinnerService: SpinnerService,
    private pageService: ImportRestorePageService,
  ) {
  }

  ngOnInit(): void {
    this.form = this.createForm();

    this.currentPageType$ = this.activatedRoute.data.pipe(
      pluck('pageType'),
      share(),
    );
  }

  public onSubmit(pageType: ImportRestorePageType): void {
    const { seedPhrase, password } = this.form.getRawValue();

    const method = pageType === ImportRestorePageType.IMPORT_ACCOUNT
      ? this.pageService.importUser(seedPhrase, password)
      : this.pageService.restoreUser(seedPhrase, password);

    this.spinnerService.showSpinner();

    method.pipe(
      finalize(() => this.spinnerService.hideSpinner()),
      untilDestroyed(this),
    ).subscribe(noop, (error) => {
      this.notificationService.error(error);
    });
  }

  public toggleSeedPhraseVisibility(): void {
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

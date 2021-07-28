import { ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, pluck, share } from 'rxjs/operators';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { NotificationService } from '@shared/services/notification';
import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { AppRoute } from '../../../app-route';
import { BaseValidationUtil, PasswordValidationUtil } from '@shared/utils/validation';
import { ImportRestorePageService } from './import-restore-page.service';
import { NavigationService } from '@core/navigation';
import { SpinnerService } from '@core/services';
import { WelcomeRoute } from '../../../welcome/welcome-route';

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
    private navigationService: NavigationService,
    private ngZone: NgZone,
    private notificationService: NotificationService,
    private router: Router,
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

    const seedPhraseControl = this.form.get('seedPhrase');
    seedPhraseControl.valueChanges
      .pipe(
        untilDestroyed(this),
      )
      .subscribe((value) => {
        seedPhraseControl.setValue(value.replace(/\s+/g, ' ').toLowerCase(), { emitEvent: false });
      });
  }

  public navigateBack(pageType: ImportRestorePageType): void {
    const urlToNavigate = (pageType === ImportRestorePageType.IMPORT_ACCOUNT)
      ? [AppRoute.Welcome, WelcomeRoute.NewUser]
      : [AppRoute.Login];

    this.navigationService.back(urlToNavigate);
  }

  public onSubmit(pageType: ImportRestorePageType): void {
    const { seedPhrase, password } = this.form.getRawValue();
    const trimmedSeedPhrase = seedPhrase.trim();

    const method = pageType === ImportRestorePageType.IMPORT_ACCOUNT
      ? this.pageService.importUser(trimmedSeedPhrase, password)
      : this.pageService.restoreUser(trimmedSeedPhrase, password);

    this.spinnerService.showSpinner();

    method.pipe(
      finalize(() => this.spinnerService.hideSpinner()),
      untilDestroyed(this),
    ).subscribe(() => {
      this.ngZone.run(() => this.router.navigate(['/']));
    }, (error) => {
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
        RxwebValidators.compare({ fieldName: 'password' }),
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

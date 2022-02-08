import { ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, pluck } from 'rxjs/operators';
import { ControlsOf, FormBuilder, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { NotificationService } from '@shared/services/notification';
import { FORM_ERROR_TRANSLOCO_READ } from '@shared/components/form-error';
import { AppRoute } from '../../../app-route';
import { BaseValidationUtil } from '@shared/utils/validation';
import { ImportRestorePageService } from './import-restore-page.service';
import { NavigationService } from '@core/navigation';
import { SpinnerService } from '@core/services';

export enum ImportRestorePageType {
  IMPORT_ACCOUNT = 'import-account',
  RESTORE_ACCOUNT = 'restore-account',
}

interface ImportRestoreForm {
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

  public currentPageType: ImportRestorePageType;

  public form: FormGroup<ControlsOf<ImportRestoreForm>>;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private navigationService: NavigationService,
    private ngZone: NgZone,
    private notificationService: NotificationService,
    private router: Router,
    private spinnerService: SpinnerService,
    private svgIconRegistry: SvgIconRegistry,
    private pageService: ImportRestorePageService,
  ) {
  }

  public get passwordControl(): FormControl<string> {
    return this.form.get('password');
  }

  public ngOnInit(): void {
    this.form = this.createForm();

    this.activatedRoute.data.pipe(
      pluck('pageType'),
      untilDestroyed(this),
    ).subscribe((currentPageType) => this.currentPageType = currentPageType);

    const seedPhraseControl = this.form.get('seedPhrase');
    seedPhraseControl.valueChanges
      .pipe(
        untilDestroyed(this),
      )
      .subscribe((value) => {
        seedPhraseControl.setValue(value.replace(/\s+/g, ' ').toLowerCase(), { emitEvent: false });
      });
  }

  public navigateBack(): void {
    const urlToNavigate = (this.currentPageType === ImportRestorePageType.IMPORT_ACCOUNT)
      ? [AppRoute.Welcome]
      : [AppRoute.Login];

    this.navigationService.back(urlToNavigate);
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const { seedPhrase, password } = this.form.getRawValue();
    const trimmedSeedPhrase = seedPhrase.trim();

    const method = this.currentPageType === ImportRestorePageType.IMPORT_ACCOUNT
      ? this.pageService.importUser(trimmedSeedPhrase, password)
      : this.pageService.restoreUser(trimmedSeedPhrase, password);

    this.spinnerService.showSpinner();

    method.pipe(
      finalize(() => this.spinnerService.hideSpinner()),
      untilDestroyed(this),
    ).subscribe({
      next: () => this.ngZone.run(() => this.router.navigate(['/'])),
      error: (error) => this.notificationService.error(error),
    });
  }

  private createForm(): FormGroup<ControlsOf<ImportRestoreForm>> {
    return this.formBuilder.group({
      password: '',
      seedPhrase: [
        '',
        [
          Validators.required,
          BaseValidationUtil.isSeedPhraseCorrect,
        ],
        [
          this.pageService.createSeedAsyncValidator(),
        ],
      ],
    });
  }
}

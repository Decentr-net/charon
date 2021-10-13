import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError, filter, finalize, map, mergeMap, pluck, switchMap, tap } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Profile } from 'decentr-js';

import { svgDelete } from '@shared/svg-icons/delete';
import { svgEdit } from '@shared/svg-icons/edit';
import { svgImportAccount } from '@shared/svg-icons/import-account';
import { svgLock } from '@shared/svg-icons/lock';
import { svgSettings } from '@shared/svg-icons/settings';
import { ConfirmationDialogService } from '@shared/components/confirmation-dialog';
import { NotificationService } from '@shared/services/notification';
import { AuthService } from '@core/auth';
import { LockService } from '@core/lock';
import { SpinnerService, UserService } from '@core/services';
import { UserRoute } from '../../user-route';

@UntilDestroy()
@Component({
  selector: 'app-user-menu-page',
  templateUrl: './user-menu-page.component.html',
  styleUrls: ['./user-menu-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenuPageComponent implements OnInit {
  public profile$: Observable<Profile>;

  public deleteConfirmationRequested: boolean;

  public readonly userRoute: typeof UserRoute = UserRoute;

  constructor(
    @Inject(TRANSLOCO_SCOPE) private translocoScope,
    private authService: AuthService,
    private confirmationDialogService: ConfirmationDialogService,
    private lockService: LockService,
    private notificationService: NotificationService,
    private spinnerService: SpinnerService,
    private translocoService: TranslocoService,
    private userService: UserService,
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgDelete,
      svgEdit,
      svgImportAccount,
      svgLock,
      svgSettings,
    ]);
  }

  public ngOnInit(): void {
    this.profile$ = this.authService.getActiveUser().pipe(
      pluck('wallet'),
      switchMap((wallet) => this.userService.getProfile(wallet.address, wallet)),
      catchError(() => EMPTY),
    );
  }

  public lockAccount(): void {
    this.lockService.lock();
  }

  public deleteAccount(): Observable<void> {
    this.spinnerService.showSpinner();

    const user = this.authService.getActiveUserInstant();
    const wallet = user.wallet;

    return this.userService.resetAccount(
      wallet.address,
      wallet.address,
      wallet.privateKey,
    ).pipe(
      tap(() => this.authService.removeUser(user.id)),
      catchError((error) => {
        this.notificationService.error(error);

        return EMPTY;
      }),
      finalize(() => this.spinnerService.hideSpinner()),
    );
  }

  public requestDeleteConfirmation(): void {
    this.translocoService.selectTranslateObject(
      'user_menu_page.delete_confirmation',
      {},
      this.translocoScope,
    ).pipe(
      map((translations) => ({
        ...translations,
        cancel: {
          label: translations.cancel,
          testId: 'cancel-delete',
        },
        confirm: {
          icon: svgDelete.name,
          label: translations.confirm,
          testId: 'confirm-delete',
        },
        alert: true,
      })),
      mergeMap((config) => this.confirmationDialogService.open(config).afterClosed()),
      filter((confirmed: boolean) => confirmed),
      mergeMap(() => this.deleteAccount()),
      untilDestroyed(this),
    ).subscribe();
  }
}

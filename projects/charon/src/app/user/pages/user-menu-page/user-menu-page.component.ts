import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError, finalize, pluck, switchMap, tap } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Profile } from 'decentr-js';

import { svgDelete } from '@shared/svg-icons/delete';
import { svgEdit } from '@shared/svg-icons/edit';
import { svgImportAccount } from '@shared/svg-icons/import-account';
import { svgLockAccount } from '@shared/svg-icons/lock-account';
import { svgSettings } from '@shared/svg-icons/settings';
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
    private authService: AuthService,
    private lockService: LockService,
    private notificationService: NotificationService,
    private spinnerService: SpinnerService,
    private userService: UserService,
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgDelete,
      svgEdit,
      svgImportAccount,
      svgLockAccount,
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

  public cancelDelete(): void {
    this.deleteConfirmationRequested = false;
  }

  public deleteAccount(): void {
    this.spinnerService.showSpinner();

    const user = this.authService.getActiveUserInstant();
    const wallet = user.wallet;

    this.userService.resetAccount(
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
      untilDestroyed(this),
    ).subscribe();
  }

  public requestDeleteConfirmation(): void {
    this.deleteConfirmationRequested = true;
  }
}

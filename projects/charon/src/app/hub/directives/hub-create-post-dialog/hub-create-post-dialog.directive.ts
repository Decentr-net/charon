import { Directive, HostListener, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { noop, Observable, timer } from 'rxjs';
import { finalize, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { NotificationService } from '@shared/services/notification';
import { SpinnerService } from '@core/services';
import { AuthService, AuthUser } from '@core/auth';
import {
  HubCreatePostDialogComponent,
  HubCreatePostDialogData,
  HubCreatePostDialogResult
} from '../../components/hub-create-post-dialog';
import { HubCreatePostService } from '../../services';
import { ONE_SECOND } from '../../../../../../../shared/utils/date';

@UntilDestroy()
@Directive({
  selector: '[appHubCreatePostDialog]'
})
export class HubCreatePostDialogDirective implements OnDestroy {
  @Input('appHubCreatePostDialogConfig') public config: MatDialogConfig<void>;

  private dialogRef: MatDialogRef<HubCreatePostDialogComponent>;

  constructor(
    private authService: AuthService,
    private matDialog: MatDialog,
    private notificationService: NotificationService,
    private hubCreatePostService: HubCreatePostService,
    private spinnerService: SpinnerService,
    private translocoService: TranslocoService,
  ) {
  }

  public ngOnDestroy() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  @HostListener('click')
  public async openCreatePostDialog(): Promise<void> {
    if (this.dialogRef) {
      return Promise.resolve();
    }

    const draft = await this.hubCreatePostService.getDraft();
    const user = this.authService.getActiveUserInstant();

    const config: MatDialogConfig<HubCreatePostDialogData> = {
      data: {
        draft,
        author: user as Required<AuthUser>,
      },
      disableClose: true,
      width: '800px',
      maxWidth: '100%',
      height: '600px',
      maxHeight: '100%',
      panelClass: 'popup-no-padding',
      ...this.config,
    };

    this.dialogRef = this.matDialog.open<HubCreatePostDialogComponent, HubCreatePostDialogData, HubCreatePostDialogResult>(
      HubCreatePostDialogComponent,
      config,
    );

    const autoSaveSubscription = this.createAutoSaveObservable(this.dialogRef).subscribe();

    this.dialogRef.afterClosed()
      .pipe(
        tap(() => autoSaveSubscription.unsubscribe()),
        mergeMap((result) => {
          if (!result.create) {
            return this.hubCreatePostService.saveDraft(result.post);
          }

          this.spinnerService.showSpinner();
          return this.hubCreatePostService.createPost(result.post).pipe(
            tap(() => {
              this.notificationService.success(
                this.translocoService.translate('hub_create_post_dialog.success', null, 'hub')
              );
            }),
          );
        }),
        finalize(() => {
          this.spinnerService.hideSpinner();
          this.dialogRef = undefined;
        }),
        untilDestroyed(this),
      )
      .subscribe(noop, (error) => {
        this.notificationService.error(error);
      });
  }

  private createAutoSaveObservable(dialogRef: MatDialogRef<HubCreatePostDialogComponent>): Observable<void> {
    return timer(ONE_SECOND * 10).pipe(
      map(() => dialogRef.componentInstance.getFinalPost()),
      switchMap((draft) => this.hubCreatePostService.saveDraft(draft)),
    );
  }
}

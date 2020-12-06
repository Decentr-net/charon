import { Directive, HostListener, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { finalize, mergeMap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { SpinnerService } from '@core/services';
import { AuthService, AuthUser } from '@core/auth';
import {
  HubCreatePostDialogComponent,
  HubCreatePostDialogData,
  HubCreatePostDialogResult
} from '../../components/hub-create-post-dialog';
import { HubCreatePostService } from '../../services';

@UntilDestroy()
@Directive({
  selector: '[appHubCreatePostDialog]'
})
export class HubCreatePostDialogDirective {
  @Input('appHubCreatePostDialogConfig') public config: MatDialogConfig<void>;

  private isDialogOpened: boolean = false;

  constructor(
    private authService: AuthService,
    private matDialog: MatDialog,
    private hubCreatePostService: HubCreatePostService,
    private spinnerService: SpinnerService,
  ) {
  }

  @HostListener('click')
  public async openCreatePostDialog(): Promise<void> {
    if (this.isDialogOpened) {
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
      width: '600px',
      maxWidth: '100%',
      maxHeight: '700px',
      panelClass: 'popup-no-padding',
      ...this.config,
    };

    this.matDialog.open<HubCreatePostDialogComponent, HubCreatePostDialogData, HubCreatePostDialogResult>(
      HubCreatePostDialogComponent,
      config,
    )
      .afterClosed()
      .pipe(
        mergeMap((result) => {
          if (!result.create) {
            return this.hubCreatePostService.saveDraft(result.post);
          }

          this.spinnerService.showSpinner();
          return this.hubCreatePostService.createPost(result.post);
        }),
        finalize(() => {
          this.spinnerService.hideSpinner();
          this.isDialogOpened = false;
        }),
        untilDestroyed(this),
      ).subscribe();
  }
}

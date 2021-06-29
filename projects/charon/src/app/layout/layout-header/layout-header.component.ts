import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { map } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MediaService } from '@core/services/media';

import { LockBrowserStorageService } from '@shared/services/lock';
import { AuthService } from '../../core/auth';

@UntilDestroy()
@Component({
  selector: 'app-layout-header',
  templateUrl: './layout-header.component.html',
  styleUrls: ['./layout-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutHeaderComponent {
  public isAuthorized: boolean;
  public isLocked: boolean;

  @Input() background: 'grey' | 'white';
  @Input() selectNetwork: boolean;
  @Input() userProfile: boolean;

  constructor(
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private lockBrowserStorageService: LockBrowserStorageService,
    public mediaService: MediaService,
  ) {
    this.authService.getActiveUser().pipe(
      map(user => user && user.registrationCompleted),
    ).subscribe((isAuthorized) => {
      this.isAuthorized = isAuthorized;
      this.changeDetectorRef.markForCheck();
    });

    this.lockBrowserStorageService.getLockedChanges().pipe(
      untilDestroyed(this),
    ).subscribe((isLocked) => {
        this.isLocked = isLocked;
      }
    );
  }
}

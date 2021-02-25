import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MediaService } from '@core/services/media';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { isAuthorized$ } from '../../../../../scripts/src/content/auth';
import { LockBrowserStorageService } from '@shared/services/lock';

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
    private lockBrowserStorageService: LockBrowserStorageService,
    public mediaService: MediaService,
  ) {
    isAuthorized$().pipe(
      untilDestroyed(this),
    ).subscribe((isAuthorized) => {
        this.isAuthorized = isAuthorized;
      }
    );

    this.lockBrowserStorageService.getLockedChanges().pipe(
      untilDestroyed(this),
    ).subscribe((isLocked) => {
        this.isLocked = isLocked;
      }
    );
  }
}

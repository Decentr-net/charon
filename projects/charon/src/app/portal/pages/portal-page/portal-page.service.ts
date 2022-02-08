import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

import { NotificationService } from '@shared/services/notification';
import { AuthService } from '@core/auth';

@Injectable()
export class PortalPageService {
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private translocoService: TranslocoService,
  ) {
  }

  public getWalletAddress(): Observable<string> {
    return this.authService.getActiveUserAddress();
  }

  public onWalletAddressCopied(): void {
    this.notificationService.success(
      this.translocoService.translate('portal_page.wallet_address_copied', null, 'portal'),
    );
  }
}

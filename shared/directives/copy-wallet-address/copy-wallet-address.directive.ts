import { Directive, HostListener, Input } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Wallet } from 'decentr-js';

import { copyContent } from '../../utils/copy-content';
import { NotificationService } from '../../services/notification';

@Directive({
  selector: '[appCopyWalletAddress]'
})
export class CopyWalletAddressDirective {
  @Input('appCopyWalletAddress') public value: Wallet['address'];

  constructor(
    private notificationService: NotificationService,
    private translocoService: TranslocoService,
  ) {
  }

  @HostListener('click')
  public onClick(): void {
    copyContent(this.value);

    this.notificationService.success(
      this.translocoService.translate('user_page.copy_wallet_address_success', null, 'user'),
    );
  }
}
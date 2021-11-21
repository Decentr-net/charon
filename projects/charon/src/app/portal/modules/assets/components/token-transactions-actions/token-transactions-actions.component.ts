import { ChangeDetectionStrategy, Component, HostListener, Input, OnInit } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { TranslocoService } from '@ngneat/transloco';

import { NotificationService } from '@shared/services/notification';
import { svgCopy } from '@shared/svg-icons/copy';
import { svgLink } from '@shared/svg-icons/link';

@Component({
  selector: 'app-token-transactions-actions',
  templateUrl: './token-transactions-actions.component.html',
  styleUrls: ['./token-transactions-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenTransactionsActionsComponent implements OnInit {
  @Input() public txhash: string;

  constructor(
    private notificationService: NotificationService,
    private svgIconRegistry: SvgIconRegistry,
    private translocoService: TranslocoService,
  ) {
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgCopy,
      svgLink,
    ]);
  }

  @HostListener('click', ['$event'])
  public onHostClick(event: Event): void {
    event.cancelBubble = true;
  }

  public onTxHashCopied(): void {
    this.notificationService.success(
      this.translocoService.translate('token_transactions_table.wallet_address_copied', null, 'portal'),
    );
  }
}

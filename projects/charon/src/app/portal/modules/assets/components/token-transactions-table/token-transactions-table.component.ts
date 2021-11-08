import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgCopy } from '@shared/svg-icons/copy';
import { svgLink } from '@shared/svg-icons/link';
import { svgReceive } from '@shared/svg-icons/receive';
import { svgSend } from '@shared/svg-icons/send';
import { groupByDate, GroupedByDate } from '@shared/utils/group-by';
import { NotificationService } from '@shared/services/notification';
import { TokenTransaction, TokenTransactionType } from './token-transactions-table.definitions';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-token-transactions-table',
  templateUrl: './token-transactions-table.component.html',
  styleUrls: ['./token-transactions-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenTransactionsTableComponent {
  @Input() public newTransactionsAfter: number;

  @Input() public set transactions(value: TokenTransaction[]) {
    this.groups = groupByDate(value || [], (item) => item.timestamp);
  }

  public tokenTransactionType: typeof TokenTransactionType = TokenTransactionType;

  public groups: GroupedByDate<TokenTransaction>;

  constructor(
    private notificationService: NotificationService,
    private svgIconRegistry: SvgIconRegistry,
    private translocoService: TranslocoService,
  ) {
    svgIconRegistry.register([
      svgCopy,
      svgLink,
      svgReceive,
      svgSend,
    ]);
  }

  public onTxHashCopied(): void {
    this.notificationService.success(
      this.translocoService.translate('token_transactions_table.wallet_address_copied', null, 'portal'),
    );
  }
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { groupBy, groupByDate, GroupedByDate } from '@shared/utils/group-by';
import { TokenTransaction, TokenTransactionMessage } from './token-transactions-table.definitions';

@Component({
  selector: 'app-token-transactions-table',
  templateUrl: './token-transactions-table.component.html',
  styleUrls: ['./token-transactions-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenTransactionsTableComponent {
  @Input() public newTransactionsAfter: number;

  @Input() public set transactions(value: TokenTransactionMessage[]) {
    this.groups = groupByDate(value || [], (item) => item.timestamp).map((group) => {
      return {
        items: groupBy(group.items, 'hash').map((groupByHash) => ({
          amount: groupByHash.items.reduce((acc, item) => acc + +item.amount, 0),
          comment: groupByHash.items[0].comment,
          fee: groupByHash.items[0].fee,
          hash: groupByHash.key,
          messages: groupByHash.items,
          timestamp: groupByHash.items[0].timestamp,
        })),
        timestamp: group.timestamp,
      };
    });
  }

  public groups: GroupedByDate<TokenTransaction>;
}

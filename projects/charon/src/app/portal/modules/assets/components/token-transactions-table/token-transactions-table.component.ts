import { ChangeDetectionStrategy, Component, Input, TrackByFunction } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { groupBy } from '@shared/utils/group-by';
import { BlocksService } from '@core/services';
import { TokenComplexTransaction } from '../token-complex-transaction';
import { TokenSingleTransaction } from '../token-single-transaction';
import { TokenTransaction } from './token-transactions-table.definitions';

interface TokenTransactionGroup {
  items: TokenTransaction[];
  height: number;
  time: Observable<string>;
}

@Component({
  selector: 'app-token-transactions-table',
  templateUrl: './token-transactions-table.component.html',
  styleUrls: ['./token-transactions-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenTransactionsTableComponent {
  @Input() public newTransactionsAfter: number;

  @Input() public set transactions(value: TokenTransaction[]) {
    this.groups = groupBy(value || [], 'height').map((group) => ({
      items: group.items,
      height: group.key,
      time: this.getTimeByHeight(group.key),
    }));
  }

  public groups: TokenTransactionGroup[];

  public heightTime: Set<TokenTransactionGroup['height']> = new Set();

  public trackByHeight: TrackByFunction<TokenTransactionGroup> = ({}, group) => group.height;

  constructor(
    private blocksService: BlocksService,
  ) {
  }

  public getTimeByHeight(height: TokenTransactionGroup['height']): Observable<string> {
    return this.blocksService.getBlock(height).pipe(
      map((block) => block.header.time),
    );
  }

  public isSingleTransaction(
    transaction: TokenSingleTransaction | TokenComplexTransaction,
  ): transaction is TokenSingleTransaction {
    return transaction instanceof TokenSingleTransaction;
  }

  public isComplexTransaction(
    transaction: TokenSingleTransaction | TokenComplexTransaction,
  ): transaction is TokenComplexTransaction {
    return transaction instanceof TokenComplexTransaction;
  }
}

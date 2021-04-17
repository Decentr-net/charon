import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { groupByDate, GroupedByDate } from '@shared/utils/group-by';
import { TokenTransaction } from './token-transactions-table.definitions';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { svgReceive, svgSend } from '../../../../../../../shared/svg-icons';

@Component({
  selector: 'app-token-transactions-table',
  templateUrl: './token-transactions-table.component.html',
  styleUrls: ['./token-transactions-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenTransactionsTableComponent {
  @Input() public set transactions(value: TokenTransaction[]) {
    this.groups = groupByDate(value, (item) => item.timestamp);
  }

  public groups: GroupedByDate<TokenTransaction>;

  constructor(
    private svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgReceive,
      svgSend,
    ]);
  }
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { TransferHistoryTransaction, TransferRole } from 'decentr-js';

import { svgReceiveCoin, svgSendCoin } from '@shared/svg-icons';

export interface AssetHistoryItem extends TransferHistoryTransaction {
  role: TransferRole;
}

@Component({
  selector: 'app-assets-history-list-item',
  templateUrl: './assets-history-list-item.component.html',
  styleUrls: ['./assets-history-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetsHistoryListItemComponent {
  @Input() public item: AssetHistoryItem;

  constructor(
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgReceiveCoin,
      svgSendCoin,
    ]);
  }
}

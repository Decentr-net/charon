import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgReceiveCoin, svgSendCoin } from '@shared/svg-icons';

@Component({
  selector: 'app-assets-history-list-item',
  templateUrl: './assets-history-list-item.component.html',
  styleUrls: ['./assets-history-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetsHistoryListItemComponent {

  constructor(
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgReceiveCoin,
      svgSendCoin,
    ]);
  }
}

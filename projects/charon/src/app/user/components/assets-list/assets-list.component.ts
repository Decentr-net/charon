import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgDecentrHub } from '@shared/svg-icons';
import { BankCoin } from 'decentr-js';

@Component({
  selector: 'app-assets-list',
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetsListComponent {
  @Input() balance: BankCoin['amount'];

  constructor(
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register(svgDecentrHub);
  }
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgSendCoin } from '@shared/svg-icons';

@Component({
  selector: 'app-user-bank-balance',
  templateUrl: './user-bank-balance.component.html',
  styleUrls: ['./user-bank-balance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBankBalanceComponent {
  @Input() bankBalance: string;

  constructor(
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register(svgSendCoin);
  }
}

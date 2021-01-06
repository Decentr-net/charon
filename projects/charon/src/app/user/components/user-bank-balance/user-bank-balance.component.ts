import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { AppRoute } from '../../../app-route';
import { svgSendCoin } from '@shared/svg-icons';
import { UserRoute } from '../../user.route';

@Component({
  selector: 'app-user-bank-balance',
  templateUrl: './user-bank-balance.component.html',
  styleUrls: ['./user-bank-balance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBankBalanceComponent {
  @Input() bankBalance: string;

  public appRoute: typeof AppRoute = AppRoute;
  public userRoute: typeof UserRoute = UserRoute;

  constructor(
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register(svgSendCoin);
  }
}

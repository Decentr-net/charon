import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { HubCurrencyStatistics } from '../hub-currency-statistics';
import { HubPDVStatistics } from '../hub-pdv-statistics';

@Component({
  selector: 'app-hub-dashboard',
  templateUrl: './hub-dashboard.component.html',
  styleUrls: ['./hub-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubDashboardComponent {
  @Input() public estimatedBalance: string;
  @Input() public pdvStatistics: HubPDVStatistics;
  @Input() public rateStatistics: HubCurrencyStatistics;
}

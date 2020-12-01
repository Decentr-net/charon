import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChartPoint } from '@shared/components/line-chart';

export interface HubCurrencyStatistics {
  fromDate: number;
  points: ChartPoint[];
  rate: number;
  rateChangedIn24HoursPercent: number;
}

@Component({
  selector: 'app-hub-currency-statistics',
  templateUrl: './hub-currency-statistics.component.html',
  styleUrls: ['./hub-currency-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubCurrencyStatisticsComponent {
  @Input() public statistics: HubCurrencyStatistics;
}

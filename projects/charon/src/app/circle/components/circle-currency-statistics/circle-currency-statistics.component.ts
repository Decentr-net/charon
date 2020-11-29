import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ChartPoint } from '@shared/components/line-chart';

export interface CircleCurrencyStatistics {
  fromDate: number;
  points: ChartPoint[];
  rate: number;
  rateChangedIn24HoursPercent: number;
}

@Component({
  selector: 'app-circle-currency-statistics',
  templateUrl: './circle-currency-statistics.component.html',
  styleUrls: ['./circle-currency-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleCurrencyStatisticsComponent {
  @Input() public statistics: CircleCurrencyStatistics;
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface CircleCurrencyStatistics {
  fromDate: number;
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

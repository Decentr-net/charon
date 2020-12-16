import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { ChartPoint } from '@shared/components/line-chart';

export interface HubCurrencyStatistics {
  fromDate: number;
  points: ChartPoint[];
  rate: string | number;
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

  @HostBinding('class.mod-negative')
  public get isNegative(): boolean {
    return this.statistics?.rateChangedIn24HoursPercent < 0;
  }

  @HostBinding('class.mod-positive')
  public get isPositive(): boolean {
    return this.statistics?.rateChangedIn24HoursPercent > 0;
  }
}

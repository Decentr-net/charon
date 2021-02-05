import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

import { ChartPoint } from '@shared/components/line-chart';

export interface HubPDVStatistics {
  pdvChangedIn24HoursPercent: number;
  fromDate: number;
  pdv: string | number;
  points: ChartPoint[];
}

@Component({
  selector: 'app-hub-pdv-statistics',
  templateUrl: './hub-pdv-statistics.component.html',
  styleUrls: ['./hub-pdv-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPdvStatisticsComponent {
  @Input() public estimatedBalance: string;
  @Input() public statistics: HubPDVStatistics;

  @HostBinding('class.mod-negative')
  public get isNegative(): boolean {
    return this.statistics?.pdvChangedIn24HoursPercent < 0;
  }

  @HostBinding('class.mod-positive')
  public get isPositive(): boolean {
    return this.statistics?.pdvChangedIn24HoursPercent > 0;
  }
}

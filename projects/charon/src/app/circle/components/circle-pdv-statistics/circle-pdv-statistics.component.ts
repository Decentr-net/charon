import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ChartPoint } from '@shared/components/line-chart';

export interface CirclePDVStatistics {
  pdvChangedIn24HoursPercent: number;
  fromDate: number;
  pdv: number;
  points: ChartPoint[];
}

@Component({
  selector: 'app-circle-pdv-statistics',
  templateUrl: './circle-pdv-statistics.component.html',
  styleUrls: ['./circle-pdv-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CirclePdvStatisticsComponent {
  @Input() public statistics: CirclePDVStatistics;
}

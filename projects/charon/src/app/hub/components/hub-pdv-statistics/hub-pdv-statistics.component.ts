import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ChartPoint } from '@shared/components/line-chart';

export interface HubPDVStatistics {
  pdvChangedIn24HoursPercent: number;
  fromDate: number;
  pdv: number;
  points: ChartPoint[];
}

@Component({
  selector: 'app-hub-pdv-statistics',
  templateUrl: './hub-pdv-statistics.component.html',
  styleUrls: ['./hub-pdv-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPdvStatisticsComponent {
  @Input() public statistics: HubPDVStatistics;
}

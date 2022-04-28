import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ChartPoint } from '@shared/components/line-chart';

export interface HubPDVStatistics {
  pdvChangedIn24HoursPercent: number;
  fromDate: number;
  pdv: string | number;
  points: ChartPoint[];
}

export interface PDVStatisticsTranslations {
  from: string;
  pdv: string;
}

@Component({
  selector: 'app-hub-pdv-statistics',
  templateUrl: './hub-pdv-statistics.component.html',
  styleUrls: ['./hub-pdv-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPdvStatisticsComponent {
  @Input() public estimatedBalance: string;

  @Input() public hideNoDataLabels: boolean;

  @Input() public statistics: HubPDVStatistics;

  @Input() public translations: PDVStatisticsTranslations;

  public get isNeutral(): boolean {
    return this.statistics?.pdvChangedIn24HoursPercent === 0;
  }

  public get isPositive(): boolean {
    return this.statistics?.pdvChangedIn24HoursPercent > 0;
  }
}

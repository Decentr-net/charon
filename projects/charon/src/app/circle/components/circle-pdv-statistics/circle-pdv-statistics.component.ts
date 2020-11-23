import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { exponentialToFixed } from '../../../shared/utils/number';
import { ChartPoint } from '../../../shared/models/chart-point.model';

export interface CirclePDVStatistics {
  pdvChangedIn24HoursPercent: number;
  fromDate: number;
  pdv: number;
}

@Component({
  selector: 'app-circle-pdv-statistics',
  templateUrl: './circle-pdv-statistics.component.html',
  styleUrls: ['./circle-pdv-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CirclePdvStatisticsComponent implements OnInit {
  @Input() public statistics: CirclePDVStatistics;

  public chartPoints$: Observable<ChartPoint[]>;

  ngOnInit(): void {
    // TODO: implement My PDV service
    this.chartPoints$ = of([
      { date: "2020-11-20", value: 10e-7 },
      { date: "2020-11-21", value: 5e-7 },
      { date: "2020-11-22", value: 8e-7 },
      { date: "2020-11-23", value: 4e-7 },
      { date: "2020-11-24", value: 15e-7 },
      { date: "2020-11-25", value: 11e-7 },
      { date: "2020-11-26", value: 9e-7 },
      { date: "2020-11-27", value: 5e-7 },
    ]).pipe(
      map(stats => stats.map(({ date, value }) => ({
        date: new Date(date).valueOf(),
        value: +exponentialToFixed(value) + 1
      })))
    );
  }
}

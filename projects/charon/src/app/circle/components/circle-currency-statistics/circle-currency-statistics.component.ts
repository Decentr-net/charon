import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { exponentialToFixed } from '../../../shared/utils/number';
import { ChartPoint } from '../../../shared/models/chart-point.model';

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

  public chartPoints$: Observable<ChartPoint[]>;

  ngOnInit(): void {
    // TODO: implement DEC Rate service
    this.chartPoints$ = of([
      { date: "2020-11-20", value: 3e-7 },
      { date: "2020-11-21", value: 5e-7 },
      { date: "2020-11-22", value: 11e-7 },
      { date: "2020-11-23", value: 3e-7 },
      { date: "2020-11-24", value: 5e-7 },
      { date: "2020-11-25", value: 8e-7 },
      { date: "2020-11-26", value: 3e-7 },
      { date: "2020-11-27", value: 5e-7 },
      { date: "2020-11-28", value: 2e-7 },
      { date: "2020-11-29", value: 7e-7 },
      { date: "2020-11-30", value: 8e-7 },
      { date: "2020-12-01", value: 8e-7 },
      { date: "2020-12-02", value: 5e-7 },
    ]).pipe(
      map(stats => stats.map(({ date, value }) => ({
        date: new Date(date).valueOf(),
        value: +exponentialToFixed(value) + 1
      })))
    );
  }
}

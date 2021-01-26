import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { UntilDestroy } from '@ngneat/until-destroy';

import { addAmountToDate, DateAmountType } from '@shared/utils/date';
import { calculateDifferencePercentage, exponentialToFixed } from '@shared/utils/number';
import { ChartPoint } from '@shared/components/line-chart';

interface FilterButton {
  amount: number;
  dateType: DateAmountType,
  label: string
}

export interface LegendData {
  rate: string;
  rateMargin: number;
  rateDate: string;
}

@UntilDestroy()
@Component({
  selector: 'app-activity-chart',
  templateUrl: './pdv-activity-chart.component.html',
  styleUrls: ['./pdv-activity-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdvActivityChartComponent implements OnInit {
  @Input() public set data(value: ChartPoint[]) {
    this.data$.next(value);
  }

  public filterButtons: FilterButton[] = [
    {dateType: DateAmountType.DAYS, amount: -7, label: '1W'},
    {dateType: DateAmountType.MONTHS, amount: -1, label: '1M'},
    {dateType: DateAmountType.MONTHS, amount: -3, label: '3M'},
    {dateType: DateAmountType.MONTHS, amount: -6, label: '6M'},
    {dateType: DateAmountType.YEARS, amount: -1, label: '1Y'},
    {dateType: DateAmountType.DAYS, amount: 0, label: 'ALL'},
  ];

  public activeFilter$ = new BehaviorSubject(this.filterButtons[this.filterButtons.length - 1]);
  public activeLegend$ = new Subject<ChartPoint>();
  public data$ = new BehaviorSubject<ChartPoint[]>(undefined);
  public chartData$: Observable<ChartPoint[]>;
  public legend$: Observable<LegendData>;

  ngOnInit(): void {
    this.chartData$ = combineLatest([
      this.data$,
      this.activeFilter$,
    ]).pipe(
      map(([data, activeFilter]) => this.filterChartData(data, activeFilter.amount, activeFilter.dateType))
    );

    this.legend$ = combineLatest([
      this.chartData$,
      this.activeLegend$,
    ]).pipe(
      map(([chartPoints, chartPoint]) => {
        if (!chartPoint) {
          return;
        }

        const pointIndex = chartPoints.indexOf(chartPoint);
        const prevChartPoint = chartPoints[pointIndex - 1] || chartPoint;
        const differencePercentage = calculateDifferencePercentage(chartPoint.value, prevChartPoint.value);

        const legendData: LegendData = {
          rateMargin: Number(differencePercentage),
          rate: exponentialToFixed(chartPoint.value),
          rateDate: this.formatDate(new Date(chartPoint.date)),
        };

        return legendData;
      }),
    )
  }

  private formatDate(date): string {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
    });
  }

  setLegendData(chartPoint: ChartPoint): void {
    this.activeLegend$.next(chartPoint);
  }

  public filterChartData(data: ChartPoint[], amount: number, dateType: DateAmountType): ChartPoint[] {
    const filterByDate = addAmountToDate(new Date(), amount, dateType).valueOf();

    if (amount === 0) {
      return data;
    }

    return data.filter((chartPoint) => chartPoint.date > filterByDate);
  }

  public setFilter(button: FilterButton) {
    this.activeFilter$.next(button);
  }
}

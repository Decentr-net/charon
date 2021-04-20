import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { addAmountToDate, DateAmountType } from '@shared/utils/date';
import { BalanceValueDynamic } from '@shared/services/pdv';
import { CoinRateFor24Hours } from '@shared/services/currency';
import { PdvRatePageService } from './pdv-rate-page.service';
import { PdvChartPoint } from '../../components/pdv-rate-chart';

interface FilterButton {
  amount: number;
  dateType: DateAmountType,
  label: string
}

@Component({
  selector: 'app-pdv-rate-page',
  templateUrl: './pdv-rate-page.component.html',
  styleUrls: ['./pdv-rate-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    PdvRatePageService,
  ],
})
export class PdvRatePageComponent {
  public coinRate$: Observable<CoinRateFor24Hours>;
  public pdvChartPoints$: Observable<PdvChartPoint[]>;
  public pdvRate$: Observable<BalanceValueDynamic>;

  public filterButtons: FilterButton[] = [
    { dateType: DateAmountType.DAYS, amount: -7, label: '1W' },
    { dateType: DateAmountType.MONTHS, amount: -1, label: '1M' },
    { dateType: DateAmountType.MONTHS, amount: -3, label: '3M' },
    { dateType: DateAmountType.MONTHS, amount: -6, label: '6M' },
    { dateType: DateAmountType.YEARS, amount: -1, label: '1Y' },
    { dateType: DateAmountType.DAYS, amount: 0, label: 'All' },
  ];

  public activeFilter$ = new BehaviorSubject(this.filterButtons[this.filterButtons.length - 1]);
  public chartData$: Observable<PdvChartPoint[]>;

  constructor(
    private pdvRateService: PdvRatePageService,
  ) {
  }

  public ngOnInit(): void {
    this.coinRate$ = this.pdvRateService.getCoinRate();
    this.pdvRate$ = this.pdvRateService.getPdvRateWithMargin();
    this.pdvChartPoints$ = this.pdvRateService.getPdvChartPoints();

    this.chartData$ = combineLatest([
      this.pdvRateService.getPdvChartPoints(),
      this.activeFilter$,
    ]).pipe(
      map(([data, activeFilter]) => this.filterChartData(data, activeFilter.amount, activeFilter.dateType)),
    );
  }

  public setFilter(button: FilterButton) {
    this.activeFilter$.next(button);
  }

  public filterChartData(data: PdvChartPoint[], amount: number, dateType: DateAmountType): PdvChartPoint[] {
    const filterByDate = addAmountToDate(new Date(), amount, dateType).valueOf();

    if (amount === 0) {
      return data;
    }

    return data.filter((chartPoint) => chartPoint[0] > filterByDate);
  }
}

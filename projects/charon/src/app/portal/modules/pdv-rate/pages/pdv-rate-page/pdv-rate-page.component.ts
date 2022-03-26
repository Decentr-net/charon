import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { svgLogoIcon } from '@shared/svg-icons/logo-icon';
import { isOpenedInTab } from '@shared/utils/browser';
import { addAmountToDate, DateAmountType } from '@shared/utils/date';
import { BalanceValueDynamic, CoinRateFor24Hours } from '@core/services';
import { PdvRatePageService, PdvReward } from './pdv-rate-page.service';
import { PdvChartPoint } from '../../components/pdv-rate-chart';

interface FilterButton {
  amount: number;
  dateType: DateAmountType;
  label: string;
}

@UntilDestroy()
@Component({
  selector: 'app-pdv-rate-page',
  templateUrl: './pdv-rate-page.component.html',
  styleUrls: ['./pdv-rate-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    PdvRatePageService,
  ],
})
export class PdvRatePageComponent implements OnInit {
  @HostBinding('class.mod-popup-view')
  public readonly isOpenedInPopup: boolean = !isOpenedInTab();

  public coinRate$: Observable<CoinRateFor24Hours>;

  public coinRateValue: number;

  public estimatedBalance$: Observable<string>;

  public pdvChartPoints$: Observable<PdvChartPoint[]>;

  public pdvRate$: Observable<BalanceValueDynamic>;

  public pdvReward$: Observable<PdvReward>;

  public pdvRewardUSD$: Observable<number>;

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
    private svgIconRegistry: SvgIconRegistry,
  ) {
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgLogoIcon,
    ]);

    this.coinRate$ = this.pdvRateService.getCoinRate();
    this.estimatedBalance$ = this.pdvRateService.getEstimatedBalance();
    this.pdvRate$ = this.pdvRateService.getPdvRateWithMargin();
    this.pdvChartPoints$ = this.pdvRateService.getPdvChartPoints();
    this.pdvReward$ = this.pdvRateService.getPdvReward();

    this.pdvRateService.getCoinRate().pipe(
      untilDestroyed(this),
    ).subscribe((coinRate) => {
      this.coinRateValue = coinRate.value;
    });

    this.pdvRewardUSD$ = combineLatest([
      this.coinRate$,
      this.pdvReward$,
    ]).pipe(
      map(([{ value: coinRate }, { reward }]) => this.pdvRateService.getPdvRewardUSD(coinRate, reward)),
    );

    this.chartData$ = combineLatest([
      this.pdvChartPoints$,
      this.activeFilter$.pipe(
        distinctUntilChanged((previous, current) => previous.amount === current.amount),
      ),
    ]).pipe(
      map(([data, activeFilter]) => this.filterChartData(data, activeFilter.amount, activeFilter.dateType)),
    );
  }

  public setFilter(button: FilterButton): void {
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

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, share, shareReplay } from 'rxjs/operators';

import { svgLink } from '@shared/svg-icons/link';
import { MicroValuePipe } from '@shared/pipes/micro-value';
import { CurrencyService } from '@shared/services/currency';
import { ReferralStats, ReferralTimeStats } from '@core/services/api';
import { ReferralService } from '@core/services';

type TimeOption = keyof ReferralTimeStats;

@Component({
  selector: 'app-referral-stats',
  templateUrl: './referral-stats.component.html',
  styleUrls: ['./referral-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferralStatsComponent implements OnInit {
  public timeOptions: TimeOption[] = [
    'last30Days',
    'total',
  ];

  public selectedTime: BehaviorSubject<TimeOption> = new BehaviorSubject(this.timeOptions[0]);

  public rewardForReferral$: Observable<number>;

  public uPDVToEarnByReferral$: Observable<number>;

  public daysForReward$: Observable<number>;

  public decRewards$: Observable<number>;

  public usdReceived$: Observable<number>;

  public link$: Observable<string>;

  public stats$: Observable<ReferralStats>;

  public isLoaded$: Observable<boolean>;

  constructor(
    private currencyService: CurrencyService,
    private microValuePipe: MicroValuePipe,
    private referralService: ReferralService,
    private svgIconRegistry: SvgIconRegistry,
  ) {
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgLink,
    ]);

    const config$ = this.referralService.getConfig().pipe(
      share(),
    );

    this.uPDVToEarnByReferral$ = config$.pipe(
      map((config) => config.thresholdUpdv),
    );

    this.daysForReward$ = config$.pipe(
      map((config) => config.thresholdDays),
    );

    this.link$ = this.referralService.getCode().pipe(
      map((code) => `https://${code}`),
      share(),
    );

    this.stats$ = combineLatest([
      this.referralService.getStats(),
      this.selectedTime,
    ]).pipe(
      map(([timeStats, time]) => timeStats[time]),
      shareReplay(1),
    );

    this.decRewards$ = this.stats$.pipe(
      map((stats) => this.microValuePipe.transform(stats.reward)),
    );

    this.usdReceived$ = combineLatest([
      this.decRewards$,
      this.currencyService.getDecentrCoinRateForUsd(),
    ]).pipe(
      map(([decRewards, coinRate]) => decRewards * coinRate),
    );

    this.rewardForReferral$ = combineLatest([
      this.stats$,
      config$,
    ]).pipe(
      map(([stats, config]) => {
        return config.senderRewardLevels.reverse().find((level) => level.from < stats.confirmed).reward;
      }),
      map(this.microValuePipe.transform),
    );

    this.isLoaded$ = combineLatest([
      config$,
      this.link$,
      this.stats$,
    ]).pipe(
      map(([...conditions]) => conditions.every(Boolean)),
    );
  }

  public selectTime(time: TimeOption): void {
    this.selectedTime.next(time);
  }
}

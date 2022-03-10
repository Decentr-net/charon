import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, share, shareReplay } from 'rxjs/operators';
import { ReferralSenderBonus, ReferralStats, ReferralTimeStats, SenderRewardLevel } from 'decentr-js';

import { AnalyticsEvent } from '@shared/analytics';
import { svgLink } from '@shared/svg-icons/link';
import { MICRO_PDV_DIVISOR, MicroValuePipe } from '@shared/pipes/micro-value';
import { ConfigService } from '@shared/services/configuration';
import { CurrencyService, ReferralService } from '@core/services';

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

  public referrals$: Observable<number>;

  public senderBonuses$: Observable<ReferralSenderBonus[]>;

  public senderRewards$: Observable<SenderRewardLevel[]>;

  public isLoaded$: Observable<boolean>;

  public analyticsEvent: typeof AnalyticsEvent = AnalyticsEvent;

  constructor(
    private configService: ConfigService,
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
      map((config) => +config.thresholdPDV * MICRO_PDV_DIVISOR),
    );

    this.daysForReward$ = config$.pipe(
      map((config) => config.thresholdDays),
    );

    this.link$ = combineLatest([
      this.configService.getReferralUrl(),
      this.referralService.getCode(),
    ]).pipe(
      map(([referralUrl, code]) => `${referralUrl}/?referralCode=${code}`),
      shareReplay(1),
    );

    this.stats$ = combineLatest([
      this.referralService.getStats(),
      this.selectedTime,
    ]).pipe(
      map(([timeStats, time]) => timeStats[time]),
      shareReplay(1),
    );

    this.decRewards$ = this.stats$.pipe(
      map((stats) => this.microValuePipe.transform(stats.reward.amount)),
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
      map(([stats, config]) => config.senderRewardLevels
        .slice()
        .reverse()
        .find((level) => (level.from - 1) <= stats.confirmed).reward
      ),
      map(this.microValuePipe.transform),
    );

    this.referrals$ = this.stats$.pipe(
      map((stats) => stats.confirmed),
    );

    this.senderBonuses$ = config$.pipe(
      map(({ senderBonus }) => senderBonus),
    );

    this.senderRewards$ = config$.pipe(
      map(({ senderRewardLevels }) => senderRewardLevels),
    )

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

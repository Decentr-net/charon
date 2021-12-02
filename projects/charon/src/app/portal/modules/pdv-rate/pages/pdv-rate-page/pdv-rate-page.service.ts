import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';

import { MICRO_PDV_DIVISOR } from '@shared/pipes/micro-value';
import { BalanceValueDynamic, PDVService } from '@shared/services/pdv';
import { BlocksService, CoinRateFor24Hours, CurrencyService } from '@core/services';
import { PdvChartPoint } from '../../components/pdv-rate-chart';

export interface PdvReward {
  latestBlock: string;
  nextDistributionHeight: string;
  reward: number;
}

@Injectable()
export class PdvRatePageService {

  constructor(
    private blocksService: BlocksService,
    private currencyService: CurrencyService,
    private pdvService: PDVService,
  ) {
  }

  public getCoinRate(): Observable<CoinRateFor24Hours> {
    return this.currencyService.getDecentrCoinRateForUsd24hours();
  }

  public getPdvRateWithMargin(): Observable<BalanceValueDynamic> {
    return this.pdvService.getBalanceWithMarginLive(false);
  }

  public getPdvChartPoints(): Observable<PdvChartPoint[]> {
    return this.pdvService.getPDVStatChartPointsLive().pipe(
      map((chartPoints) => {
        return chartPoints.map((chartPoint) => [chartPoint.date, chartPoint.value]);
      }),
    );
  }

  public getPdvReward(): Observable<PdvReward> {
    return combineLatest([
      this.pdvService.getTokenBalance(),
      this.pdvService.getTokenPool(),
      this.blocksService.getLatestBlock(),
    ]).pipe(
      map(([balance, pool, latestBlock]) => ({
        latestBlock: latestBlock.block.header.height,
        nextDistributionHeight: pool.nextDistributionHeight,
        reward: +pool.size[0].amount / +pool.totalDelta * +balance.balanceDelta,
      })),
    );
  }

  public getPdvRewardUSD(coinRate: number, reward: number): number {
    return coinRate * reward / MICRO_PDV_DIVISOR;
  }

  public getEstimatedBalance(): Observable<string> {
    return this.pdvService.getEstimatedBalance();
  }
}

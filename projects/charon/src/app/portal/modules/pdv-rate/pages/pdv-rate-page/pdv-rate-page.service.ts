import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';

import { BlocksService } from '@core/services';
import { BalanceValueDynamic, PDVService } from '@shared/services/pdv';
import { CoinRateFor24Hours, CurrencyService } from '@shared/services/currency';
import { PdvChartPoint } from '../../components/pdv-rate-chart';

export interface PdvReward {
  balanceDelta: string;
  latestBlock: string;
  nextDistributionHeight: string;
  poolSize: string;
  totalDelta: string;
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
        balanceDelta: balance.balanceDelta,
        latestBlock: latestBlock.block.header.height,
        nextDistributionHeight: pool.nextDistributionHeight,
        poolSize: pool.size[0].amount,
        totalDelta: pool.totalDelta,
      })),
    );
  }

  public getEstimatedBalance(): Observable<string> {
    return this.pdvService.getEstimatedBalance();
  }
}

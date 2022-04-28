import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { MICRO_PDV_DIVISOR } from '@shared/pipes/micro-value';
import { BalanceValueDynamic, BlocksService, CurrencyService, PDVService } from '@core/services';
import { PdvChartPoint } from '../../components/pdv-rate-chart';

export interface PdvReward {
  nextDistributionDate: Date;
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

  public getCoinRate(): Observable<number> {
    return this.currencyService.getDecentrCoinRateForUsd();
  }

  public getPdvRateWithMargin(): Observable<BalanceValueDynamic> {
    return this.pdvService.getBalanceWithMargin();
  }

  public getPdvChartPoints(): Observable<PdvChartPoint[]> {
    return this.pdvService.getPDVStatChartPoints().pipe(
      map((chartPoints) => {
        return chartPoints.map((chartPoint) => [chartPoint.date, chartPoint.value]);
      }),
    );
  }

  public getPdvReward(): Observable<PdvReward> {
    return this.pdvService.getPDVDelta().pipe(
      map((pdvDelta) => ({
        nextDistributionDate: new Date(pdvDelta.pool.next_distribution_date),
        reward: +pdvDelta.delta
          ? +pdvDelta.pool.size / +pdvDelta.pool.total_delta * +pdvDelta.delta
          : 0,
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

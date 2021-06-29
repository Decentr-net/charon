import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { BalanceValueDynamic, PDVService } from '@shared/services/pdv';
import { CoinRateFor24Hours, CurrencyService } from '@shared/services/currency';
import { PdvChartPoint } from '../../components/pdv-rate-chart';

@Injectable()
export class PdvRatePageService {

  constructor(
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

  public getEstimatedBalance(): Observable<string> {
    return this.pdvService.getEstimatedBalance();
  }
}

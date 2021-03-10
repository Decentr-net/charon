import { combineLatest, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  PDV,
  PDVDetails,
  PDVListItem,
  PDVListPaginationOptions,
  Wallet,
} from 'decentr-js';

import { calculateDifferencePercentage, exponentialToFixed } from '../../utils/number';
import { PDVApiService } from './api';
import { BalanceValueDynamic, PDVStatChartPoint } from './pdv.definitions';
import { ConfigService } from '../configuration';
import { environment } from '../../../environments/environment';

export class PDVService {
  private configService: ConfigService;
  private pdvApiService: PDVApiService;

  constructor(
  ) {
    this.configService = new ConfigService(environment);
    this.pdvApiService = new PDVApiService(this.configService);
  }

  public getBalance(api: string, walletAddress: string): Observable<string> {
    return from(this.pdvApiService.getBalance(api, walletAddress)).pipe(
      map(exponentialToFixed),
    );
  }

  public getPDVDetails(
    api: string,
    address: PDVListItem,
    wallet: Wallet,
  ): Observable<PDVDetails> {
    return from(this.pdvApiService.getPDVDetails(api, address, wallet));
  }

  public getPDVList(
    api: string,
    walletAddress: Wallet['address'],
    paginationOptions?: PDVListPaginationOptions,
  ): Observable<PDVListItem[]> {
    return from(this.pdvApiService.getPDVList(api, walletAddress, paginationOptions));
  }

  public getPDVStatChartPoints(walletAddress: string): Observable<PDVStatChartPoint[]> {
    return from(this.pdvApiService.getPDVStats(walletAddress)).pipe(
      map((stats) => stats
        .map(({ date, value }) => ({
          date: new Date(date).valueOf(),
          value,
        }))
        .sort((a, b) => a.date - b.date)
      ),
    );
  }

  public getBalanceWithMargin(api: string, walletAddress: string): Observable<BalanceValueDynamic> {
    return combineLatest([
      this.getBalance(api, walletAddress),
      this.getPDVStatChartPoints(walletAddress),
    ])
      .pipe(
        map(([pdvRate, pdvRateHistory]) => {
          const now = new Date;
          const historyDate = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - 1);
          const historyPdvRate = pdvRateHistory.find(el => el.date === historyDate)?.value;
          const dayMargin = calculateDifferencePercentage(Number(pdvRate), historyPdvRate);

          return {
            dayMargin,
            value: pdvRate,
          };
        })
      )
  }

  public sendPDV(api: string, wallet: Wallet, pdv: PDV[]): Promise<void> {
    return this.pdvApiService.sendPDV(api, wallet, pdv);
  }
}

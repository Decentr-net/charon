import { Injectable, Injector, OnDestroy } from '@angular/core';
import { combineLatest, EMPTY, Observable } from 'rxjs';
import { catchError, map, pluck } from 'rxjs/operators';
import { Post } from 'decentr-js';

import { AuthService } from '@core/auth/services';
import { coerceTimestamp } from '@shared/utils/date';
import { HubCurrencyStatistics } from '../../components/hub-currency-statistics';
import { HubPDVStatistics } from '../../components/hub-pdv-statistics';
import { HubPostsService } from '../../services';
import { NetworkService, PDVService } from '@core/services';
import { PostsApiService } from '@core/services/api';
import { NotificationService } from '@shared/services/notification';
import { CurrencyService } from '@shared/services/currency';

interface CoinRateHistory {
  date: number,
  value: number,
}

@Injectable()
export class OverviewPageService extends HubPostsService implements OnDestroy {
  protected loadingInitialCount: number = 20;
  protected loadingMoreCount: number = 20;

  constructor(
    private authService: AuthService,
    private currencyService: CurrencyService,
    private networkService: NetworkService,
    private pdvService: PDVService,
    private postsApiService: PostsApiService,
    protected notificationService: NotificationService,
    injector: Injector,
  ) {
    super(injector);
  }

  public ngOnDestroy() {
    this.dispose();
  }

  public getEstimatedBalance(): Observable<string> {
    return this.pdvService.getEstimatedBalance();
  }

  private getUserRegisteredAt(): Observable<string> {
    const user = this.authService.getActiveUserInstant();

    return this.userService.getPublicProfile(user.wallet.address).pipe(
      pluck('registeredAt'),
    );
  }

  public getPdvStatistics(): Observable<HubPDVStatistics> {
    return combineLatest([
      this.pdvService.getBalanceWithMargin(),
      this.pdvService.getPDVStatChartPoints(),
      this.getUserRegisteredAt(),
    ])
      .pipe(
        map(([pdvWithMargin, pdvStatistic, userRegisteredAt]) => {

          return ({
            fromDate: coerceTimestamp(userRegisteredAt),
            pdv: pdvWithMargin.value,
            pdvChangedIn24HoursPercent: pdvWithMargin.dayMargin,
            points: pdvStatistic,
          });
        })
      );
  }

  public getCoinRateStatistics(): Observable<HubCurrencyStatistics> {
    return combineLatest([
      this.currencyService.getDecentrCoinRateForUsd24hours(),
      this.getDecentCoinRateHistory(365),
    ])
      .pipe(
        map(([rateWithMargin, rateStatistic]) => ({
            points: rateStatistic,
            rate: rateWithMargin.value,
            rateChangedIn24HoursPercent: rateWithMargin.dayMargin,
          })
        )
      );
  }

  protected loadPosts(fromPost: Post | undefined, count: number): Observable<Post[]> {
    const api = this.networkService.getActiveNetworkInstant().api;

    return this.postsApiService.getPopularPosts(api, 'month', {
      limit: count,
      fromOwner: fromPost && fromPost.owner,
      fromUUID: fromPost && fromPost.uuid,
    }).pipe(
      catchError((error) => {
        this.notificationService.error(error);
        return EMPTY;
      }),
    );
  }

  private getDecentCoinRateHistory(days: number): Observable<CoinRateHistory[]> {
    return this.currencyService.getDecentCoinRateHistory(days).pipe(
      map((historyElements) => historyElements.map((historyElement) => ({
        date: historyElement[0],
        value: historyElement[1],
      })))
    );
  }
}

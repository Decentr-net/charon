import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from 'decentr-js';

import { HubCurrencyStatistics } from '../../components/hub-currency-statistics';
import { HubPDVStatistics } from '../../components/hub-pdv-statistics';
import { HubPageService } from '../hub-page/hub-page.service';
import { HubPostsService } from '../../services';
import { NetworkService, UserService } from '@core/services';
import { PostsApiService } from '@core/services/api';

@Injectable()
export class OverviewPageService extends HubPostsService {
  constructor(
    private hubPageService: HubPageService,
    private networkService: NetworkService,
    private postsApiService: PostsApiService,
    userService: UserService,
  ) {
    super(userService);
  }

  public ngOnDestroy() {
    this.dispose();
  }

  public getPdvStatistics(): Observable<HubPDVStatistics> {
    return combineLatest([
      this.hubPageService.getBalanceWithMargin(),
      this.hubPageService.getPDVChartPoints(),
    ])
      .pipe(
        map(([pdvWithMargin, pdvStatistic]) => {
          const minDate: number = Math.min(...pdvStatistic.map(el => el.date));

          return ({
            fromDate: new Date(minDate).valueOf(),
            pdv: pdvWithMargin.value,
            pdvChangedIn24HoursPercent: pdvWithMargin.dayMargin,
            points: pdvStatistic,
          });
        })
      );
  }

  public getCoinRateStatistics(): Observable<HubCurrencyStatistics> {
    return combineLatest([
      this.hubPageService.getCoinRateWithMargin(),
      this.hubPageService.getDecentCoinRateHistory(365),
    ])
      .pipe(
        map(([rateWithMargin, rateStatistic]) => {
            const minDate: number = Math.min(...rateStatistic.map(el => el.date));

            return ({
              fromDate: new Date(minDate).valueOf(),
              points: rateStatistic,
              rate: rateWithMargin.value,
              rateChangedIn24HoursPercent: rateWithMargin.dayMargin,
            });
          }
        )
      )
  }

  protected loadPosts(fromPost: Post | undefined, count: number): Observable<Post[]> {
    const api = this.networkService.getActiveNetworkInstant().api;

    return this.postsApiService.getPopularPosts(api, 'month', {
      limit: count,
      fromOwner: fromPost && fromPost.owner,
      fromUUID: fromPost && fromPost.uuid,
    });
  }
}

import { ChangeDetectionStrategy, Component, TrackByFunction } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { CirclePDVStatistics } from '../../components/circle-pdv-statistics';
import { CircleCurrencyStatistics } from '../../components/circle-currency-statistics';
import { CircleActivityStatistics, CircleDataValueSource } from '../../components/circle-activity-statistics';
import { OverviewPageService } from './overview-page.service';

@UntilDestroy()
@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    OverviewPageService,
  ],
})
export class OverviewPageComponent {
  public pdvStatistics: CirclePDVStatistics = {
    fromDate: Date.now(),
    pdv: 1.5,
    pdvChangedIn24HoursPercent: 13,
  };

  public rateStatistics: CircleCurrencyStatistics = {
    fromDate: Date.now(),
    rate: 1.5,
    rateChangedIn24HoursPercent: 13,
  };

  public activityStatistics: CircleActivityStatistics = {
    pdv: {
      [CircleDataValueSource.Activity]: 60,
      [CircleDataValueSource.Platform]: 40,
    },
  }

  public readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public readonly posts$: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public readonly loadingCount = 4;

  constructor(
    private overviewPageService: OverviewPageService,
  ) {
  }

  private get posts(): any[] {
    return this.posts$.value;
  }

  public ngOnInit() {
    this.loadMore();
  }

  public loadMore(): void {
    this.isLoading$.next(true);

    const lastPostAddress = this.posts.length
      ? this.posts[this.posts.length - 1].address
      : 0;

    this.overviewPageService.getHighestPdvPosts(lastPostAddress, this.loadingCount)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.isLoading$.next(false)),
        untilDestroyed(this),
      )
      .subscribe((posts) => {
        this.posts$.next([...this.posts$.value, ...posts]);
      });
  }

  public trackByPostAddress: TrackByFunction<any> = ({}, { address }) => address;
}

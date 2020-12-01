import { ChangeDetectionStrategy, Component, TrackByFunction } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { HubPDVStatistics } from '../../components/hub-pdv-statistics';
import { HubCurrencyStatistics } from '../../components/hub-currency-statistics';
import { HubActivityStatistics, HubDataValueSource } from '../../components/hub-activity-statistics';
import { OverviewPageService } from './overview-page.service';
import { HUB_HEADER_CONTENT_SLOT } from '../../components/hub-header';

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
  public headerContentSlotName = HUB_HEADER_CONTENT_SLOT;

  public pdvStatistics: HubPDVStatistics = {
    fromDate: Date.now(),
    pdv: 1.5,
    pdvChangedIn24HoursPercent: 13,
    points: [
      { date: 1605830400000, value: 1.0000001 },
      { date: 1605916800000, value: 1.0000005 },
      { date: 1606003200000, value: 1.0000008 },
      { date: 1606089600000, value: 1.0000004 },
      { date: 1606176000000, value: 1.0000015 },
      { date: 1606262400000, value: 1.0000011 },
      { date: 1606348800000, value: 1.0000009 },
      { date: 1606435200000, value: 1.0000005 },
    ]
  };

  public rateStatistics: HubCurrencyStatistics = {
    fromDate: Date.now(),
    points: [
      { date: 1605830400000, value: 1.0000003 },
      { date: 1605916800000, value: 1.0000005 },
      { date: 1606003200000, value: 1.0000011 },
      { date: 1606089600000, value: 1.0000003 },
      { date: 1606176000000, value: 1.0000005 },
      { date: 1606262400000, value: 1.0000008 },
      { date: 1606348800000, value: 1.0000003 },
      { date: 1606435200000, value: 1.0000005 },
      { date: 1606521600000, value: 1.0000002 },
      { date: 1606608000000, value: 1.0000007 },
      { date: 1606694400000, value: 1.0000008 },
      { date: 1606780800000, value: 1.0000008 },
      { date: 1606867200000, value: 1.0000005 },
    ],
    rate: 1.5,
    rateChangedIn24HoursPercent: 13,
  };

  public activityStatistics: HubActivityStatistics = {
    pdv: {
      [HubDataValueSource.Activity]: 60,
      [HubDataValueSource.Platform]: 40,
    },
  };

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

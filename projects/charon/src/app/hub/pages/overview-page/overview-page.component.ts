import { ChangeDetectionStrategy, Component, TrackByFunction } from '@angular/core';
import { Observable } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Post } from 'decentr-js';

import { HubPDVStatistics } from '../../components/hub-pdv-statistics';
import { HubCurrencyStatistics } from '../../components/hub-currency-statistics';
import { HubActivityStatistics, HubDataValueSource } from '../../components/hub-activity-statistics';
import { OverviewPageService } from './overview-page.service';
import { HUB_HEADER_CONTENT_SLOT } from '../../components/hub-header';
import { HubPageService } from '../hub-page/hub-page.service';

@UntilDestroy()
@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    HubPageService,
    OverviewPageService,
  ],
})
export class OverviewPageComponent {
  public headerContentSlotName = HUB_HEADER_CONTENT_SLOT;

  public pdvStatistics$: Observable<HubPDVStatistics>;

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

  public isLoading$: Observable<boolean>;
  public posts$: Observable<Post[]>;
  public canLoadMore$: Observable<boolean>;

  private readonly loadingCount = 4;

  constructor(private overviewPageService: OverviewPageService) {
  }

  public ngOnInit() {
    this.pdvStatistics$ = this.overviewPageService.getPdvStatistics();

    this.posts$ = this.overviewPageService.posts$;

    this.isLoading$ = this.overviewPageService.isLoading$;

    this.canLoadMore$ = this.overviewPageService.canLoadMore$;

    this.loadMore();
  }

  public loadMore(): void {
    this.overviewPageService.loadMorePosts(this.loadingCount);
  }

  public trackByPostId: TrackByFunction<Post> = ({}, { uuid }) => uuid;
}

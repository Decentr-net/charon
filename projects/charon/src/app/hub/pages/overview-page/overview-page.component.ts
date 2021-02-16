import { ChangeDetectionStrategy, ChangeDetectorRef, Component, TrackByFunction } from '@angular/core';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Post } from 'decentr-js';

import { HubPDVStatistics } from '../../components/hub-pdv-statistics';
import { HubCurrencyStatistics } from '../../components/hub-currency-statistics';
import { HubActivityStatistics, HubDataValueSource } from '../../components/hub-activity-statistics';
import { OverviewPageService } from './overview-page.service';
import { HUB_HEADER_CONTENT_SLOT } from '../../components/hub-header';
import { HubPostsService } from '../../services';
import { PostWithAuthor } from '../../models/post';

@UntilDestroy()
@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    OverviewPageService,
    {
      provide: HubPostsService,
      useExisting: OverviewPageService,
    },
  ],
})
export class OverviewPageComponent {
  public headerContentSlotName = HUB_HEADER_CONTENT_SLOT;

  public estimatedBalance$: Observable<string>;
  public pdvStatistics: HubPDVStatistics;
  public rateStatistics$: Observable<HubCurrencyStatistics>;

  public activityStatistics: HubActivityStatistics = {
    pdv: {
      [HubDataValueSource.Activity]: 60,
      [HubDataValueSource.Platform]: 40,
    },
  };

  public isLoading$: Observable<boolean>;
  public posts$: Observable<PostWithAuthor[]>;
  public canLoadMore$: Observable<boolean>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private overviewPageService: OverviewPageService,
  ) {
  }

  public ngOnInit() {
    this.overviewPageService.getPdvStatistics().pipe(
      untilDestroyed(this),
    ).subscribe((statistics) => {
      this.pdvStatistics = statistics;
      this.changeDetectorRef.detectChanges();
    });

    this.estimatedBalance$ = this.overviewPageService.getEstimatedBalance();

    this.rateStatistics$ = this.overviewPageService.getCoinRateStatistics();

    this.posts$ = this.overviewPageService.posts$;

    this.isLoading$ = this.overviewPageService.isLoading$;

    this.canLoadMore$ = this.overviewPageService.canLoadMore$;

    this.overviewPageService.loadInitialPosts();
  }

  public loadMore(): void {
    this.overviewPageService.loadMorePosts();
  }

  public trackByPostId: TrackByFunction<Post> = ({}, { uuid }) => uuid;
}

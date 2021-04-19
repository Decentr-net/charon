import { ChangeDetectionStrategy, Component, OnInit, TrackByFunction } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { InfiniteLoadingPresenter } from '@shared/utils/infinite-loading';
import { ActivityListItem } from './activity-page.definitions';
import { ActivityPageService } from './activity-page.service';

@Component({
  selector: 'app-activity-page',
  templateUrl: './activity-page.component.html',
  styleUrls: ['./activity-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ActivityPageService,
  ],
})
export class ActivityPageComponent extends InfiniteLoadingPresenter<ActivityListItem> implements OnInit {
  public readonly skeletonLoaderTheme = {
    height: '48px',
    marginBottom: '0',
    width: '100%'
  };

  constructor(
    activityPageService: ActivityPageService,
  ) {
    super(activityPageService);
  }

  public get activityList$(): Observable<ActivityListItem[]> {
    return combineLatest([
      this.isLoading$,
      this.list$,
    ]).pipe(
      map(([isLoading, list]) => !list.length && isLoading ? undefined : list),
    );
  }

  public ngOnInit(): void {
    this.infiniteLoadingService.loadMoreItems();
  }

  public trackBy: TrackByFunction<ActivityListItem> = ({}, item) => item.timestamp;
}

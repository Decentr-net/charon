import { ChangeDetectionStrategy, Component, OnInit, TrackByFunction } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { isOpenedInTab } from '@shared/utils/browser';
import { InfiniteLoadingPresenter } from '@shared/utils/infinite-loading';
import { ACTIVITY_DATE_FORMAT, ActivityListItem } from './activity-page.definitions';
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
  public readonly isOpenedInTab: boolean = isOpenedInTab();

  public readonly skeletonLoaderTheme = {
    height: '24px',
    marginBottom: '24px',
    width: '100%',
  };

  public readonly dateFormat: string = ACTIVITY_DATE_FORMAT;

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

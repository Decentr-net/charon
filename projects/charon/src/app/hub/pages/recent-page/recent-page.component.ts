import { ChangeDetectionStrategy, Component, OnInit, TrackByFunction } from '@angular/core';
import { Observable } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Post } from 'decentr-js';

import { RecentPageService } from './recent-page.service';

@UntilDestroy()
@Component({
  selector: 'app-recent-page',
  templateUrl: './recent-page.component.html',
  styleUrls: ['./recent-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    RecentPageService,
  ],
})
export class RecentPageComponent implements OnInit {
  public isLoading$: Observable<boolean>;
  public posts$: Observable<Post[]>;
  public canLoadMore$: Observable<boolean>;

  private readonly loadingCount: number = 4;

  constructor(private recentPageService: RecentPageService) {
  }

  public ngOnInit() {
    this.posts$ = this.recentPageService.posts$;

    this.isLoading$ = this.recentPageService.isLoading$;

    this.canLoadMore$ = this.recentPageService.canLoadMore$;

    this.loadMore();
  }

  public loadMore(): void {
    this.recentPageService.loadMorePosts(this.loadingCount);
  }

  public trackByPostId: TrackByFunction<Post> = ({}, { uuid }) => uuid;
}

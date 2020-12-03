import { ChangeDetectionStrategy, Component, OnInit, TrackByFunction } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from 'decentr-js';

import { FeedPageService } from './feed-page.service';

@Component({
  selector: 'app-feed-page',
  templateUrl: './feed-page.component.html',
  styleUrls: ['./feed-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    FeedPageService,
  ],
})
export class FeedPageComponent implements OnInit {
  public isLoading$: Observable<boolean>;
  public posts$: Observable<Post[]>;

  private readonly loadingCount: number = 20;

  constructor(private feedPageService: FeedPageService) {
  }

  public ngOnInit() {
    this.posts$ = this.feedPageService.posts$;

    this.isLoading$ = this.feedPageService.isLoading$;

    this.loadMore();
  }

  public loadMore(): void {
    this.feedPageService.loadMorePosts(this.loadingCount);
  }

  public trackByPostId: TrackByFunction<Post> = ({}, { uuid }) => uuid;
}

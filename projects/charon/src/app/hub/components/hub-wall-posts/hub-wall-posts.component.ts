import { ChangeDetectionStrategy, Component, OnInit, TrackByFunction } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from 'decentr-js';

import { HubPostsService } from '../../services';

@Component({
  selector: 'app-hub-wall-posts',
  templateUrl: './hub-wall-posts.component.html',
  styleUrls: ['./hub-wall-posts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubWallPostsComponent implements OnInit {
  public isLoading$: Observable<boolean>;
  public posts$: Observable<Post[]>;
  public canLoadMore$: Observable<boolean>;

  constructor(private hubPostsService: HubPostsService) {
  }

  public ngOnInit() {
    this.posts$ = this.hubPostsService.posts$;

    this.isLoading$ = this.hubPostsService.isLoading$;

    this.canLoadMore$ = this.hubPostsService.canLoadMore$;

    this.loadMore();
  }

  public loadMore(): void {
    this.hubPostsService.loadMorePosts();
  }

  public trackByPostId: TrackByFunction<Post> = ({}, { uuid }) => uuid;
}

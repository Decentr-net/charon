import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  OnInit,
  TemplateRef,
  TrackByFunction,
} from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { PostsListItem } from '@core/services';
import { HubPostsService } from '../../services';

@Component({
  selector: 'app-hub-wall-posts',
  templateUrl: './hub-feed-posts.component.html',
  styleUrls: ['./hub-feed-posts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubFeedPostsComponent implements OnInit {
  @Input() public postLinkFn: (post: PostsListItem) => unknown[];

  public isLoading$: Observable<boolean>;

  public posts$: Observable<PostsListItem[]>;

  public canLoadMore$: Observable<boolean>;

  @ContentChild('noPosts') public noPostsTemplate: TemplateRef<void>;

  constructor(private hubPostsService: HubPostsService) {
  }

  public ngOnInit(): void {
    this.posts$ = this.hubPostsService.posts$.pipe(
      shareReplay(1),
    );

    this.isLoading$ = this.hubPostsService.isLoading$.pipe(
      shareReplay(1),
    );

    this.canLoadMore$ = this.hubPostsService.canLoadMore$;

    this.hubPostsService.loadInitialPosts();
  }

  public loadMore(): void {
    this.hubPostsService.loadMorePosts();
  }

  public trackByPostId: TrackByFunction<PostsListItem> = ({}, { uuid }) => uuid;
}

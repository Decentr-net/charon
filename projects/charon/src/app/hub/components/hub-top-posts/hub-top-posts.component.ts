import { ChangeDetectionStrategy, Component, Input, OnInit, TrackByFunction } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Post, PostCategory } from 'decentr-js';

import { PostsListItem } from '@core/services';
import { HubPostsService } from '../../services';
import { HubTopPostsService } from './hub-top-posts.service';
import { HubRoute } from '../../hub-route';

@UntilDestroy()
@Component({
  selector: 'app-hub-top-posts',
  templateUrl: './hub-top-posts.component.html',
  styleUrls: ['./hub-top-posts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    HubTopPostsService,
    {
      provide: HubPostsService,
      useExisting: HubTopPostsService,
    },
  ],
})
export class HubTopPostsComponent implements OnInit {
  @Input() public set category(value: PostCategory) {
    this.category$.next(value);
  }

  @Input() public routerLinkFn: (post: Post) => unknown[];

  public hubRoute: typeof HubRoute = HubRoute;

  public isLoading$: Observable<boolean>;
  public posts$: Observable<PostsListItem[]>;
  public canLoadMore$: Observable<boolean>;

  public category$: ReplaySubject<PostCategory> = new ReplaySubject(1);

  public disableCategory$: Observable<boolean>;

  constructor(private hubTopPostsService: HubTopPostsService) {
  }

  public ngOnInit(): void {
    this.posts$ = this.hubTopPostsService.posts$;

    this.isLoading$ = this.hubTopPostsService.isLoading$;

    this.canLoadMore$ = this.hubTopPostsService.canLoadMore$;

    this.category$.pipe(
      untilDestroyed(this)
    ).subscribe((category) => {
      this.hubTopPostsService.setCategory(category);
    });

    this.disableCategory$ = this.category$.pipe(
      map(Boolean),
    );

    this.routerLinkFn = this.routerLinkFn || (() => ['./']);
  }

  public loadMore(): void {
    this.hubTopPostsService.loadMorePosts();
  }

  public trackByPostId: TrackByFunction<Post> = ({}, { uuid }) => uuid;
}

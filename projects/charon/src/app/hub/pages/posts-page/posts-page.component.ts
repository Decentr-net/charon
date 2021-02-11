import { ChangeDetectionStrategy, Component, TrackByFunction } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post, PostCategory } from 'decentr-js';
import { Observable } from 'rxjs';
import { pluck, share } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { HUB_HEADER_CONTENT_SLOT } from '../../components/hub-header';
import { PostsPageService } from './posts-page.service';
import { HubCategoryRouteParam } from '../../hub-route';
import { HubPostsService } from '../../services';
import { PostWithLike } from '../../models/post';

@UntilDestroy()
@Component({
  selector: 'app-posts-page',
  templateUrl: './posts-page.component.html',
  styleUrls: ['./posts-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: HubPostsService,
      useClass: PostsPageService
    },
  ],
})
export class PostsPageComponent {
  public headerContentSlotName = HUB_HEADER_CONTENT_SLOT;

  public isLoading$: Observable<boolean>;
  public posts$: Observable<PostWithLike[]>;
  public canLoadMore$: Observable<boolean>;

  public postsCategory: PostCategory;

  constructor(
    private activatedRoute: ActivatedRoute,
    private postsPageService: HubPostsService,
  ) {
  }

  public ngOnInit() {
    this.posts$ = this.postsPageService.posts$;

    this.isLoading$ = this.postsPageService.isLoading$.pipe(
      share()
    );

    this.canLoadMore$ = this.postsPageService.canLoadMore$;

    this.activatedRoute.params.pipe(
      pluck(HubCategoryRouteParam),
      untilDestroyed(this),
    ).subscribe((category) => {
      this.postsCategory = category;
      this.postsPageService.reload();
    });
  }

  public loadMore(): void {
    this.postsPageService.loadMorePosts();
  }

  public trackByPostId: TrackByFunction<Post> = ({}, { uuid }) => uuid;
}

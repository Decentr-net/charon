import { ChangeDetectionStrategy, ChangeDetectorRef, Component, TrackByFunction } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post, PostCategory } from 'decentr-js';
import { Observable } from 'rxjs';
import { pluck, share } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { HUB_HEADER_CONTENT_SLOT } from '../../components/hub-header';
import { PostsPageService } from './posts-page.service';
import { HubCategoryRouteParam, HubRoute } from '../../hub-route';
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

  public hubRoute: typeof HubRoute = HubRoute;

  public isLoading$: Observable<boolean>;
  public canLoadMore$: Observable<boolean>;
  public posts: PostWithLike[];

  public postsCategory: PostCategory;

  public isPostOutletActivated: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private postsPageService: HubPostsService,
  ) {
  }

  public ngOnInit() {
    this.postsPageService.posts$.pipe(
      untilDestroyed(this),
    ).subscribe((posts) => {
      this.posts = posts;
      this.changeDetectorRef.markForCheck();
    });

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

  public onPostOutletActivate(): void {
    this.isPostOutletActivated = true;
  }

  public onPostOutletDeactivate(): void {
    this.isPostOutletActivated = false;
  }

  public trackByPostId: TrackByFunction<Post> = ({}, { uuid }) => uuid;
}

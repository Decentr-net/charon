import { ChangeDetectionStrategy, Component, TrackByFunction } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'decentr-js';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { UntilDestroy } from '@ngneat/until-destroy';

import { HUB_HEADER_CONTENT_SLOT } from '../../components/hub-header';
import { PostsPageService } from './posts-page.service';
import { HubCategoryRouteParam } from '../../hub-route';
import { HubPostsService } from '../../services';

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
  public posts$: Observable<Post[]>;
  public canLoadMore$: Observable<boolean>;

  private readonly loadingCount: number = 4;

  constructor(
    private activatedRoute: ActivatedRoute,
    private postsPageService: HubPostsService,
  ) {
  }

  public ngOnInit() {
    this.posts$ = this.postsPageService.posts$;

    this.isLoading$ = this.postsPageService.isLoading$;

    this.canLoadMore$ = this.postsPageService.canLoadMore$;

    this.activatedRoute.params.pipe(
      pluck(HubCategoryRouteParam),
    ).subscribe(() => {
      this.postsPageService.clear();
      this.loadMore();
    });
  }

  public loadMore(): void {
    this.postsPageService.loadMorePosts(this.loadingCount);
  }

  public trackByPostId: TrackByFunction<Post> = ({}, { uuid }) => uuid;
}

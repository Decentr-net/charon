import { Injectable, Injector, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { PostsListFilterOptions } from 'decentr-js';

import { PostsListItem } from '@core/services';
import { HubPostsService } from '../../services';
import { HubCategoryRouteParam } from '../../hub-route';

@Injectable()
export class PostsPageService extends HubPostsService implements OnDestroy {
  protected loadingInitialCount: number = 20;
  protected loadingMoreCount: number = 20;

  constructor(
    private activatedRoute: ActivatedRoute,
    injector: Injector,
  ) {
    super(injector);
  }

  public ngOnDestroy(): void {
    this.dispose();
  }

  protected loadPosts(fromPost: PostsListItem | undefined, count: number, filter: PostsListFilterOptions): Observable<PostsListItem[]> {
    return this.postsService.getPosts({
      after: fromPost && `${fromPost.owner}/${fromPost.uuid}`,
      category: +this.activatedRoute.snapshot.params[HubCategoryRouteParam] || undefined,
      limit: count,
      ...filter,
    });
  }
}

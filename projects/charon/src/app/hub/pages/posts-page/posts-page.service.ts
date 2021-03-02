import { Injectable, Injector, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { PostsListItem } from '@core/services';
import { HubPostsService } from '../../services';
import { HubCategoryRouteParam } from '../../hub-route';

@Injectable()
export class PostsPageService extends HubPostsService implements OnDestroy {
  protected loadingInitialCount: number = 20;
  protected loadingMoreCount: number = 20;
  protected includeProfile: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    injector: Injector,
  ) {
    super(injector);
  }

  public ngOnDestroy() {
    this.dispose();
  }

  protected loadPosts(fromPost: PostsListItem | undefined, count: number): Observable<PostsListItem[]> {
    return this.postsService.getPosts({
      after: fromPost && `${fromPost.owner}/${fromPost.uuid}`,
      category: this.activatedRoute.snapshot.params[HubCategoryRouteParam],
      limit: count,
    });
  }
}

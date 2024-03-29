import { Injectable, Injector, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { PostsListFilterOptions } from 'decentr-js';

import { AuthService } from '@core/auth';
import { HubPostsService } from '../../services';
import { PostsListItem } from '../../../core/services';

@Injectable()
export class MyPostsPageService extends HubPostsService implements OnDestroy {
  protected override loadingInitialCount = 20;

  protected override loadingMoreCount = 20;

  constructor(
    private authService: AuthService,
    injector: Injector,
  ) {
    super(injector);
  }

  public ngOnDestroy(): void {
    this.dispose();
  }

  protected loadPosts(fromPost: PostsListItem | undefined, count: number, filter: PostsListFilterOptions): Observable<PostsListItem[]> {
    const { wallet: { address } } = this.authService.getActiveUserInstant();

    return this.postsService.getPosts({
      after: fromPost && `${fromPost.owner}/${fromPost.uuid}`,
      limit: count,
      owner: address,
      ...filter,
    });
  }
}

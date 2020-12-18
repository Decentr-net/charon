import { Injectable, Injector, OnDestroy } from '@angular/core';
import { Post } from 'decentr-js';
import { Observable } from 'rxjs';

import { NetworkService } from '@core/services';
import { PostsApiService } from '@core/services/api';
import { HubPostsService } from '../../services';

@Injectable()
export class FeedPageService extends HubPostsService implements OnDestroy {
  protected loadingCount: number = 20;

  constructor(
    private networkService: NetworkService,
    private postsApiService: PostsApiService,
    injector: Injector,
  ) {
    super(injector);
  }

  public ngOnDestroy() {
    this.dispose();
  }

  protected loadPosts(fromPost: Post | undefined, count: number): Observable<Post[]> {
    return this.postsApiService.getPopularPosts(
      this.networkService.getActiveNetworkInstant().api,
      'day',
      {
        fromOwner: fromPost && fromPost.owner,
        fromUUID: fromPost && fromPost.uuid,
        limit: count,
      }
    );
  }
}

import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from 'decentr-js';

import { NetworkSelectorService } from '@core/network-selector';
import { PostsApiService } from '@core/services/api';
import { BaseHubPostsService } from '../../services';

@Injectable()
export class RecentPageService extends BaseHubPostsService implements OnDestroy {
  constructor(
    private networkService: NetworkSelectorService,
    private postsApiService: PostsApiService
  ) {
    super();
  }

  public ngOnDestroy() {
    this.dispose();
  }

  protected loadPosts(fromPost: Post | undefined, count: number): Observable<Post[]> {
    const api = this.networkService.getActiveNetworkInstant().api;

    return this.postsApiService.getLatestPosts(api,{
      limit: count,
      fromOwner: fromPost && fromPost.owner,
      fromUUID: fromPost && fromPost.uuid,
    });
  }
}

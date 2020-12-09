import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from 'decentr-js';

import { PostsApiService } from '@core/services/api';
import { NetworkService, UserService } from '@core/services';
import { HubPostsService } from '../../services';

@Injectable()
export class OverviewPageService extends HubPostsService {
  constructor(
    private networkService: NetworkService,
    private postsApiService: PostsApiService,
    userService: UserService,
  ) {
    super(userService);
  }

  public ngOnDestroy() {
    this.dispose();
  }

  protected loadPosts(fromPost: Post | undefined, count: number): Observable<Post[]> {
    const api = this.networkService.getActiveNetworkInstant().api;

    return this.postsApiService.getPopularPosts(api, 'month', {
      limit: count,
      fromOwner: fromPost && fromPost.owner,
      fromUUID: fromPost && fromPost.uuid,
    });
  }
}

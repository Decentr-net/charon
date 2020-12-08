import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from 'decentr-js';

import { AuthService } from '@core/auth';
import { NetworkSelectorService } from '@core/network-selector';
import { PostsApiService } from '@core/services/api';
import { UserService } from '@core/services';
import { HubPostsService } from '../../services';

@Injectable()
export class MyWallPageService extends HubPostsService implements OnDestroy {
  constructor(
    private authService: AuthService,
    private networkService: NetworkSelectorService,
    private postsApiService: PostsApiService,
    userService: UserService,
  ) {
    super(userService);
  }

  public ngOnDestroy() {
    this.dispose();
  }

  protected loadPosts(fromPost: Post | undefined, count: number): Observable<Post[]> {
    const { wallet: { address } } = this.authService.getActiveUserInstant();

    const api = this.networkService.getActiveNetworkInstant().api;

    return this.postsApiService.getUserPosts(api, address, {
      limit: count,
      from: fromPost && fromPost.uuid,
    });
  }
}

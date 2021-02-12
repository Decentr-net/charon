import { Injectable, Injector, OnDestroy } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Post, PostCategory } from 'decentr-js';

import { NetworkService } from '@core/services';
import { PostsApiService } from '@core/services/api';
import { HubPostsService } from '../../services';
import { PostWithLike } from '../../models/post';

@Injectable()
export class HubTopPostsService extends HubPostsService<PostWithLike> implements OnDestroy {
  protected loadingInitialCount: number = 4;
  protected loadingMoreCount: number = 4;
  protected includeProfile: boolean = false;

  protected postsCategory: PostCategory;

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

  public setCategory(category: PostCategory): void {
    this.postsCategory = category;
    this.reload();
  }

  protected loadPosts(fromPost: Post | undefined, count: number): Observable<Post[]> {
    const api = this.networkService.getActiveNetworkInstant().api;

    return this.postsApiService.getPopularPosts(api, 'month', {
      category: this.postsCategory,
      limit: count,
      fromOwner: fromPost && fromPost.owner,
      fromUUID: fromPost && fromPost.uuid,
    }).pipe(
      catchError((error) => {
        this.notificationService.error(error);
        return EMPTY;
      }),
    );
  }
}

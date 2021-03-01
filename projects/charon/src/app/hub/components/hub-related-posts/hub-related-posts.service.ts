import { Injectable, Injector, OnDestroy } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Post, PostCategory } from 'decentr-js';

import { NetworkService } from '@core/services';
import { PostsApiService } from '@core/services/api';
import { HubPostsService } from '../../services';

@Injectable()
export class HubRelatedPostsService extends HubPostsService implements OnDestroy {
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
  }

  public setLoadingCount(count: number): void {
    this.loadingInitialCount = count;
  }

  protected loadPosts(fromPost: Post | undefined, count: number): Observable<Post[]> {
    return this.postsApiService.getPopularPosts(
      this.networkService.getActiveNetworkInstant().api,
      'month',
      {
        category: this.postsCategory,
        limit: count,
        fromOwner: fromPost && fromPost.owner,
        fromUUID: fromPost && fromPost.uuid,
      },
    ).pipe(
      catchError((error) => {
        this.notificationService.error(error);
        return EMPTY;
      }),
    );
  }
}

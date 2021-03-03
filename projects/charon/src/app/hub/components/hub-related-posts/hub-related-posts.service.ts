import { Injectable, Injector, OnDestroy } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PostCategory } from 'decentr-js';

import { PostsListItem } from '@core/services';
import { HubPostsService } from '../../services';

@Injectable()
export class HubRelatedPostsService extends HubPostsService implements OnDestroy {
  protected postsCategory: PostCategory;

  constructor(injector: Injector) {
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

  protected loadPosts(fromPost: PostsListItem | undefined, count: number): Observable<PostsListItem[]> {
    return this.postsService.getPosts({
      after: fromPost && `${fromPost.owner}/${fromPost.uuid}`,
      category: this.postsCategory,
      limit: count,
      sortBy: 'pdv'
    }).pipe(
      catchError((error) => {
        this.notificationService.error(error);
        return EMPTY;
      }),
    );
  }
}

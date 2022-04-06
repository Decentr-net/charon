import { Injectable, Injector, OnDestroy } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PostCategory, PostsListFilterOptions } from 'decentr-js';

import { PostsListItem } from '@core/services';
import { HubPostsService } from '../../services';

@Injectable()
export class HubTopPostsService extends HubPostsService implements OnDestroy {
  protected loadingInitialCount: number = 4;
  protected loadingMoreCount: number = 4;
  protected includeProfile: boolean = false;

  protected postsCategory: PostCategory;

  constructor(injector: Injector) {
    super(injector);
  }

  public ngOnDestroy(): void {
    this.dispose();
  }

  public setCategory(category: PostCategory): void {
    this.postsCategory = category;
    this.reload();
  }

  protected loadPosts(fromPost: PostsListItem | undefined, count: number, filter: PostsListFilterOptions): Observable<PostsListItem[]> {
    return this.postsService.getPosts({
      after: fromPost && `${fromPost.owner}/${fromPost.uuid}`,
      category: this.postsCategory,
      limit: count,
      sortBy: 'pdv',
      ...filter,
    }).pipe(
      catchError((error) => {
        this.notificationService.error(error);
        return EMPTY;
      }),
    );
  }
}

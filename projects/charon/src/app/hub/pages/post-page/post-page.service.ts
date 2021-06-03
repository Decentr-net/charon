import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, EMPTY, Observable } from 'rxjs';
import { catchError, map, pluck, share, switchMap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { NotificationService } from '@shared/services/notification';
import { PostsListItem, PostsService } from '@core/services';
import { HubPostIdRouteParam, HubPostOwnerRouteParam } from '../../hub-route';
import { HubLikesService, HubPostsService } from '../../services';

@UntilDestroy()
@Injectable()
export class PostPageService {
  private readonly post$: Observable<PostsListItem>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private hubLikesService: HubLikesService,
    private notificationService: NotificationService,
    private postsService: PostsService,
    private hubPostsService: HubPostsService,
    private router: Router,
  ) {
    const post$ = this.activatedRoute.params.pipe(
      switchMap((params) => this.getPostLive(
        params[HubPostOwnerRouteParam],
        params[HubPostIdRouteParam],
      )),
      catchError(() => {
        this.navigateBack();
        return EMPTY;
      }),
    );

    this.post$ = combineLatest([
      post$,
      this.hubLikesService.likeMap$,
    ]).pipe(
      map(([post, likeMap]) => HubLikesService.patchPostsWithLikeMap([post], likeMap)),
      pluck(0),
      share(),
    );
  }

  public getPost(): Observable<PostsListItem> {
    return this.post$;
  }

  public deletePost(post: PostsListItem): void {
    this.hubPostsService.deletePost(post).pipe(
      untilDestroyed(this),
    ).subscribe(() => this.navigateBack());
  }

  private getPostLive(owner: PostsListItem['owner'], postId: PostsListItem['uuid']): Observable<PostsListItem> {
    return this.postsService.getPost({ owner, uuid: postId });
  }

  private navigateBack(): void {
    this.router.navigate(['../../../']);
  }
}

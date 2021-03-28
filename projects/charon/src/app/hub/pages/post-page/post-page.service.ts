import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';
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
    this.post$ = this.activatedRoute.params.pipe(
      switchMap((params) => this.getPostChanges(
        params[HubPostOwnerRouteParam],
        params[HubPostIdRouteParam]),
      ),
    );
  }

  public getPost(): Observable<PostsListItem> {
    return combineLatest([
      this.post$,
      this.hubLikesService.likeMap$,
    ]).pipe(
      map(([post, likeMap]) => HubLikesService.patchPostsWithLikeMap([post], likeMap)),
      pluck(0),
    );
  }

  public deletePost(post: PostsListItem): void {
    this.hubPostsService.deletePost(post).pipe(
      untilDestroyed(this),
    ).subscribe(() => this.router.navigate(['../../../']));
  }

  private getPostChanges(
    owner: PostsListItem['owner'],
    postId: PostsListItem['uuid'],
  ): Observable<PostsListItem> {
    return this.hubPostsService.getPostChanges(postId).pipe(
      switchMap((post) => post ? of(post) : this.getPostLive(owner, postId)),
    );
  }

  private getPostLive(owner: PostsListItem['owner'], postId: PostsListItem['uuid']): Observable<PostsListItem> {
    return this.postsService.getPost({ owner, uuid: postId });
  }
}

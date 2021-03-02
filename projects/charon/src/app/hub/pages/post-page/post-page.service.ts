import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, mapTo, mergeMap, switchMap, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LikeWeight } from 'decentr-js';

import { NotificationService } from '@shared/services/notification';
import { PostsListItem, PostsService } from '@core/services';
import { HubPostIdRouteParam, HubPostOwnerRouteParam } from '../../hub-route';
import { HubPostsService } from '../../services';

@UntilDestroy()
@Injectable()
export class PostPageService {
  private readonly post$: BehaviorSubject<PostsListItem> = new BehaviorSubject(void 0);

  constructor(
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private postsService: PostsService,
    private hubPostsService: HubPostsService,
    private router: Router,
  ) {
    this.activatedRoute.params.pipe(
      switchMap((params) => this.getPostChanges(
        params[HubPostOwnerRouteParam],
        params[HubPostIdRouteParam]),
      ),
      untilDestroyed(this),
    ).subscribe(this.post$);
  }

  public getPost(): Observable<PostsListItem> {
    return this.post$;
  }

  public deletePost(post: PostsListItem): void {
    this.hubPostsService.deletePost(post).pipe(
      untilDestroyed(this),
    ).subscribe(() => this.router.navigate(['../../../']));
  }

  public likePost(postId: PostsListItem['uuid'], likeWeight: LikeWeight): Observable<void> {
    const targetPost = this.hubPostsService.getPost(postId);

    if (targetPost) {
      return this.hubPostsService.likePost(postId, likeWeight);
    }

    const post = this.post$.value;

    const update = HubPostsService.getPostLikesCountUpdate(post, likeWeight);
    this.updatePost({
      likeWeight,
      ...update,
    });

    return this.postsService.likePost(this.post$.value, likeWeight).pipe(
      catchError((error) => {
        this.notificationService.error(error);

        return of(void 0);
      }),
      mergeMap(() => this.getPostLive(post.owner, post.uuid)),
      tap((post) => this.updatePost(post)),
      mapTo(void 0),
    );
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

  private updatePost(update: Partial<PostsListItem>): void {
    this.post$.next({
      ...this.post$.value,
      ...update,
    });
  }
}

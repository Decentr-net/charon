import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { LikeWeight } from 'decentr-js';

import { NotificationService } from '@shared/services/notification';
import { AuthService } from '@core/auth';
import { PostsListItem, PostsService } from '@core/services';

export type CanLikeState = 'updating' | 'disabled' | 'enabled';

export type LikeMap = Map<PostsListItem['uuid'], LikeWeight>;

@Injectable()
export class HubLikesService {
  public static isLikeUpdating: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public likeMap$: BehaviorSubject<LikeMap> = new BehaviorSubject(new Map());

  constructor(
    protected authService: AuthService,
    protected notificationService: NotificationService,
    protected postsService: PostsService,
  ) {
  }

  private get likeMap(): LikeMap {
    return this.likeMap$.value;
  }

  private set likeMap(value: LikeMap) {
    this.likeMap$.next(value);
  }

  public canLikePost(postOwner: PostsListItem['owner']): Observable<CanLikeState> {
    const walletAddress = this.authService.getActiveUserInstant().wallet.address;

    if (postOwner === walletAddress) {
      return of('disabled');
    }

    return HubLikesService.isLikeUpdating.pipe(
      map((isUpdating) => isUpdating ? 'updating' : 'enabled'),
    );
  }

  public likePost(post: PostsListItem, likeWeight: LikeWeight): Observable<void> {
    if (HubLikesService.isLikeUpdating.value) {
      return;
    }

    HubLikesService.isLikeUpdating.next(true);

    const oldPostLike = post.likeWeight;

    this.likeMap = this.likeMap.set(post.uuid, likeWeight);

    return this.postsService.likePost(post, likeWeight).pipe(
      catchError((error) => {
        this.notificationService.error(error);
        this.likeMap = this.likeMap.set(post.uuid, oldPostLike);

        return of(void 0);
      }),
      finalize(() => HubLikesService.isLikeUpdating.next(false)),
    );
  }
}

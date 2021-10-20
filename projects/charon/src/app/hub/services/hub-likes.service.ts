import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { LikeWeight } from 'decentr-js';

import { MICRO_PDV_DIVISOR } from '@shared/pipes/micro-value';
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

  public static patchPostsWithLikeMap<T extends PostsListItem>(posts: T[], likeMap: LikeMap): T[] {
    return posts.map((post) => {
      if (!likeMap.has(post.uuid)) {
        return post;
      }

      const likeWeight = likeMap.get(post.uuid);
      const postLikePatch = HubLikesService.getPostUpdateAfterLike(post, likeWeight);
      return {
        ...post,
        likeWeight,
        ...postLikePatch,
      };
    });
  }

  public static getPostUpdateAfterLike<T extends PostsListItem>(
    post: T,
    newLikeWeight: LikeWeight,
  ): Partial<Pick<T, 'likesCount' | 'dislikesCount' | 'pdv' | 'stats'>> {
    switch (post.likeWeight) {
      case LikeWeight.Up:
        switch (newLikeWeight) {
          case LikeWeight.Up:
            return {};
          case LikeWeight.Zero:
            return {
              likesCount: post.likesCount - 1,
              ...HubLikesService.getPostPDVUpdate(post, -1),
            };
          case LikeWeight.Down:
            return {
              likesCount: post.likesCount - 1,
              dislikesCount: post.dislikesCount + 1,
              ...HubLikesService.getPostPDVUpdate(post, -2),
            };
        }
        break;
      case LikeWeight.Down:
        switch (newLikeWeight) {
          case LikeWeight.Up:
            return {
              likesCount: post.likesCount + 1,
              dislikesCount: post.dislikesCount - 1,
              ...HubLikesService.getPostPDVUpdate(post, 2),
            };
          case LikeWeight.Zero:
            return {
              dislikesCount: post.dislikesCount - 1,
              ...HubLikesService.getPostPDVUpdate(post, 1),
            };
          case LikeWeight.Down:
            return {};
        }
        break;
      case LikeWeight.Zero:
        switch (newLikeWeight) {
          case LikeWeight.Up:
            return {
              likesCount: post.likesCount + 1,
              ...HubLikesService.getPostPDVUpdate(post, 1),
            };
          case LikeWeight.Down:
            return {
              dislikesCount: post.dislikesCount + 1,
              ...HubLikesService.getPostPDVUpdate(post, -1),
            };
        }
    }
  }

  private static getPostPDVUpdate<T extends PostsListItem>(post: T, pdvChange: number): Pick<T, 'pdv' | 'stats'> {
    const newPDV = post.pdv + pdvChange / MICRO_PDV_DIVISOR;
    const now = new Date();
    const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const todayStatsIndex = (post.stats || []).findIndex((stat) => new Date(stat.date).valueOf() === today);

    if (todayStatsIndex > -1) {
      return {
        pdv: newPDV,
        stats: [
          ...post.stats.slice(0, todayStatsIndex),
          {
            ...post.stats[todayStatsIndex],
            value: newPDV,
          },
          ...post.stats.slice(todayStatsIndex + 1),
        ],
      };
    }

    const todayStatDate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    return {
      pdv: newPDV,
      stats: [
        ...post.stats,
        {
          date: todayStatDate,
          value: newPDV,
        },
      ],
    };
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

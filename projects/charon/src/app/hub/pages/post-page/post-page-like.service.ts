import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';
import { LikeWeight, Post } from 'decentr-js';

import { AuthService } from '@core/auth';
import { HubLikesService, HubPostsService } from '../../services';
import { PostWithLike } from '../../models/post';
import { PostPageService } from './post-page.service';

@Injectable()
export class PostPageLikeService extends HubLikesService {
  public static isLikeUpdating: BehaviorSubject<boolean> = HubLikesService.isLikeUpdating;

  constructor(
    authService: AuthService,
    hubPostsService: HubPostsService,
    private postPageService: PostPageService,
  ) {
    super(authService, hubPostsService);
  }

  public canLikePost(): Observable<boolean> {
    const walletAddress = this.authService.getActiveUserInstant().wallet.address;

    return this.postPageService.getPost().pipe(
      switchMap((post) => {
        return post.owner === walletAddress
          ? of(false)
          : PostPageLikeService.isLikeUpdating.pipe(
            map((isUpdating) => !isUpdating),
          );
      }),
    )
  }

  public getPostChanges(): Observable<PostWithLike> {
    return this.postPageService.getPost();
  }

  public likePost(postId: Post['uuid'], likeWeight: LikeWeight): Observable<void> {
    if (HubLikesService.isLikeUpdating.value) {
      return;
    }

    HubLikesService.isLikeUpdating.next(true);

    return this.postPageService.likePost(postId, likeWeight).pipe(
      finalize(() => HubLikesService.isLikeUpdating.next(false)),
    );
  }
}

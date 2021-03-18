import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, switchMap } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Wallet } from 'decentr-js';

import { svgArrowLeft } from '@shared/svg-icons';
import { AuthService } from '@core/auth';
import { FollowingService, PostsListItem } from '@core/services';
import { AppRoute } from '../../../app-route';
import { HubRoute } from '../../hub-route';
import { HubProfile } from '../../components/hub-profile-card';
import { PostPageService } from './post-page.service';
import { PostPageLikeService } from './post-page-like.service';
import { UserRoute } from '../../../user';
import { RECEIVER_WALLET_PARAM } from '../../../user/pages';
import { HubPDVStatistics } from '../../components/hub-pdv-statistics';
import { calculateDifferencePercentage } from '../../../../../../../shared/utils/number';

@UntilDestroy()
@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    PostPageService,
    PostPageLikeService,
  ],
})
export class PostPageComponent implements OnInit {
  public readonly appRoute: typeof AppRoute = AppRoute;
  public readonly hubRoute: typeof HubRoute = HubRoute;

  public post$: Observable<PostsListItem>;

  public authorProfile$: Observable<HubProfile>;

  public postStatistics$: Observable<HubPDVStatistics>;

  public trackByPostId: TrackByFunction<PostsListItem> = ({}, { uuid }) => uuid;

  public postLinkFn: (post: PostsListItem) => string[] = (post) => ['../../', post.owner, post.uuid];

  private isFollowingAuthor: boolean;

  constructor(
    private authService: AuthService,
    private elementRef: ElementRef<HTMLElement>,
    private followingService: FollowingService,
    private postPageService: PostPageService,
    private router: Router,
    public postPageLikeService: PostPageLikeService,
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register(svgArrowLeft);
  }

  public ngOnInit(): void {
    this.post$ = this.postPageService.getPost().pipe(
      filter(post => !!post),
    );

    this.post$.pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      this.isFollowingAuthor = undefined;
    });

    const walletAddress = this.authService.getActiveUserInstant().wallet.address;

    this.authorProfile$ = combineLatest([
      this.post$,
      this.post$.pipe(
        switchMap(() => this.followingService.getFollowees(walletAddress)),
      ),
      FollowingService.isFollowingUpdating$,
    ]).pipe(
      map(([post, followees, isFollowingUpdating]) => {
        return {
          ...post.author,
          isUserProfile: post.owner === walletAddress,
          isFollowing: this.isFollowingAuthor !== undefined
            ? this.isFollowingAuthor
            : (followees || []).includes(post.owner),
          isFollowingUpdating,
        };
      }),
    );

    this.post$.pipe(
      pluck('uuid'),
      distinctUntilChanged(),
      untilDestroyed(this),
    ).subscribe(() => this.elementRef.nativeElement.scrollTop = 0);

    this.postStatistics$ = this.post$.pipe(
      map((post) => {
        const now = new Date();
        const historyDate = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        const historyPdvRate = (post.stats || []).find(el => new Date(el.date).valueOf() === historyDate)?.value;
        const dayMargin = calculateDifferencePercentage(Number(post.pdv), historyPdvRate);

        return {
          pdvChangedIn24HoursPercent: dayMargin,
          fromDate: post.createdAt,
          pdv: post.pdv,
          points: (post.stats || [])
            .map(({ date, value }) => ({
              date: new Date(date).valueOf(),
              value,
            }))
            .sort((left, right) => left.date - right.date),
        };
      }),
    );
  }

  public onPostDelete(post: PostsListItem): void {
    this.postPageService.deletePost(post);
  }

  public onFollowAuthor(follow: boolean, author: Wallet['address']): void {
    this.isFollowingAuthor = follow;

    const func = follow
      ? this.followingService.follow(author)
      : this.followingService.unfollow(author);

    func.pipe(
      untilDestroyed(this),
    ).subscribe();
  }

  public onTopUpAuthor(author: Wallet['address']): void {
    this.router.navigate(['/', AppRoute.User, UserRoute.Transfer], {
      queryParams: {
        [RECEIVER_WALLET_PARAM]: author,
      },
    });
  }
}

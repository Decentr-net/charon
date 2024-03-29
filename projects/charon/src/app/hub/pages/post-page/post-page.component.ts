import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Optional,
} from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Wallet } from 'decentr-js';

import { svgLink } from '@shared/svg-icons/link';
import { AnalyticsEvent } from '@shared/analytics';
import { AuthService } from '@core/auth';
import { FollowingService, PostsListItem } from '@core/services';
import { AppRoute } from '../../../app-route';
import { RECEIVER_WALLET_PARAM } from '../../../portal/modules/assets/pages';
import { HubRoute } from '../../hub-route';
import { HubPDVStatistics, PDVStatisticsTranslations } from '../../components/hub-pdv-statistics';
import { HubProfile } from '../../components/hub-profile-card';
import { PostPageService } from './post-page.service';
import { getHubPDVStats } from '../../utils/pdv';
import { PortalRoute } from '../../../portal';
import { ScrollablePage } from '../scrollable-page';

@UntilDestroy()
@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    PostPageService,
  ],
})
export class PostPageComponent implements OnInit {
  public readonly appRoute: typeof AppRoute = AppRoute;

  public readonly hubRoute: typeof HubRoute = HubRoute;

  public post: PostsListItem;

  public authorProfile: HubProfile;

  public postStatistics: HubPDVStatistics;

  public postStatisticsTranslations$: Observable<PDVStatisticsTranslations>;

  private isFollowingAuthor: boolean;

  public readonly analyticsEvent: typeof AnalyticsEvent = AnalyticsEvent;

  public postLinkFn: (post: PostsListItem) => string[] = (post) => ['../../', post.owner, post.uuid];

  constructor(
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private elementRef: ElementRef<HTMLElement>,
    private followingService: FollowingService,
    private postPageService: PostPageService,
    private svgIconRegistry: SvgIconRegistry,
    private router: Router,
    private translocoService: TranslocoService,
    @Optional() private scrollablePage: ScrollablePage,
  ) {
  }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      svgLink,
    ]);

    const post$ = this.postPageService.getPost().pipe(
      filter(post => !!post),
    );

    post$.pipe(
      untilDestroyed(this),
    ).subscribe((post) => {
      this.scrollablePage?.setScrollTop(0);

      this.isFollowingAuthor = undefined;
      this.post = post;

      this.changeDetectorRef.detectChanges();
    });

    const walletAddress = this.authService.getActiveUserInstant().wallet.address;

    combineLatest([
      post$,
      post$.pipe(
        switchMap(() => this.followingService.getFollowees()),
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
      untilDestroyed(this),
    ).subscribe((authorProfile) => {
      this.authorProfile = authorProfile;
      this.changeDetectorRef.detectChanges();
    });

    post$.pipe(
      map((post) => post.uuid),
      distinctUntilChanged(),
      untilDestroyed(this),
    ).subscribe(() => this.elementRef.nativeElement.scrollTop = 0);

    post$.pipe(
      map((post) => getHubPDVStats(post.stats, post.pdv, post.createdAt)),
      untilDestroyed(this),
    ).subscribe((postStatistics) => {
      this.postStatistics = postStatistics;
      this.changeDetectorRef.detectChanges();
    });

    this.postStatisticsTranslations$ = this.translocoService
      .selectTranslateObject('hub_post_page.post_statistics', null, 'hub');
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
    this.router.navigate(['/', AppRoute.Portal, PortalRoute.Assets, PortalRoute.Transfer], {
      queryParams: {
        [RECEIVER_WALLET_PARAM]: author,
      },
    });
  }
}

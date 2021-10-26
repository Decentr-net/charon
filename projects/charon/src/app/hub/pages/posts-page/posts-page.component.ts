import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, OnInit,
  TrackByFunction,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post, PostCategory } from 'decentr-js';
import { fromEvent, Observable, timer } from 'rxjs';
import { filter, pluck, share } from 'rxjs/operators';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { svgEdit } from '@shared/svg-icons/edit';
import { AUTHORIZED_LAYOUT_HEADER_ACTIONS_SLOT } from '@core/layout/authorized-layout';
import { PostsListItem } from '@core/services';
import { AppRoute } from '../../../app-route';
import { PostsPageService } from './posts-page.service';
import { HubCategoryRouteParam, HubRoute } from '../../hub-route';
import { HubPostsService } from '../../services';

@UntilDestroy()
@Component({
  selector: 'app-posts-page',
  templateUrl: './posts-page.component.html',
  styleUrls: ['./posts-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: HubPostsService,
      useClass: PostsPageService
    },
  ],
})
export class PostsPageComponent implements OnInit {
  public headerActionsSlotName = AUTHORIZED_LAYOUT_HEADER_ACTIONS_SLOT;

  public appRoute: typeof AppRoute = AppRoute;
  public hubRoute: typeof HubRoute = HubRoute;

  public isLoading$: Observable<boolean>;
  public canLoadMore$: Observable<boolean>;
  public posts: PostsListItem[];

  public postsCategory: PostCategory;

  public isPostOutletActivated: boolean;

  public trackByPostId: TrackByFunction<PostsListItem> = this.postsPageService.trackByPostId;

  private scrollPosition: number;

  public postLinkFn: (post: Post) => string[] = (post) => [HubRoute.Post, post.owner, post.uuid];

  constructor(
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private elementRef: ElementRef<HTMLElement>,
    private postsPageService: HubPostsService,
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgEdit,
    ]);
  }

  public ngOnInit(): void {
    this.postsPageService.posts$.pipe(
      untilDestroyed(this),
    ).subscribe((posts) => {
      this.posts = posts;
      this.changeDetectorRef.markForCheck();
    });

    this.isLoading$ = this.postsPageService.isLoading$.pipe(
      share()
    );

    this.canLoadMore$ = this.postsPageService.canLoadMore$;

    this.activatedRoute.params.pipe(
      pluck(HubCategoryRouteParam),
      untilDestroyed(this),
    ).subscribe((category) => {
      this.postsCategory = category;
      this.postsPageService.reload();
    });

    fromEvent(this.elementRef.nativeElement, 'scroll').pipe(
      filter(() => !this.isPostOutletActivated),
      untilDestroyed(this),
    ).subscribe(() => this.scrollPosition = this.elementRef.nativeElement.scrollTop);
  }

  public loadMore(): void {
    this.postsPageService.loadMorePosts();
  }

  public onPostOutletActivate(): void {
    this.isPostOutletActivated = true;

    this.setScrollTop(0);
  }

  public onPostOutletDeactivate(): void {
    this.isPostOutletActivated = false;

    this.setScrollTop(this.scrollPosition);
  }

  private setScrollTop(value: number): void {
    timer(0).pipe(
      untilDestroyed(this),
    ).subscribe(() => this.elementRef.nativeElement.scrollTop = value || 0);
  }
}

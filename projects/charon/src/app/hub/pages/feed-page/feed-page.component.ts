import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { fromEvent, Observable, timer } from 'rxjs';
import { filter } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { Post } from 'decentr-js';

import {
  AUTHORIZED_LAYOUT_HEADER_ACTIONS_SLOT,
  AUTHORIZED_LAYOUT_HEADER_LOGO_SLOT
} from '@core/layout/authorized-layout';
import { PostsListItem } from '@core/services';
import { HubPostsService } from '../../services';
import { FeedPageService } from './feed-page.service';
import { AppRoute } from '../../../app-route';
import { HubRoute } from '../../hub-route';
import { svgEdit } from '@shared/svg-icons/edit';

@UntilDestroy()
@Component({
  selector: 'app-feed-page',
  templateUrl: './feed-page.component.html',
  styleUrls: ['./feed-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: HubPostsService,
      useClass: FeedPageService,
    },
  ],
})
export class FeedPageComponent implements OnInit {
  public headerActionsSlotName = AUTHORIZED_LAYOUT_HEADER_ACTIONS_SLOT;
  public headerLogoSlotName = AUTHORIZED_LAYOUT_HEADER_LOGO_SLOT;

  public appRoute: typeof AppRoute = AppRoute;
  public hubRoute: typeof HubRoute = HubRoute;

  public isLoading$: Observable<boolean>;
  public posts$: Observable<PostsListItem[]>;

  public isPostOutletActivated: boolean;

  private scrollPosition: number;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private elementRef: ElementRef<HTMLElement>,
    private feedPageService: HubPostsService,
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgEdit,
    ]);
  }

  public ngOnInit(): void {
    this.posts$ = this.feedPageService.posts$;

    this.isLoading$ = this.feedPageService.isLoading$;

    this.feedPageService.loadInitialPosts();

    fromEvent(this.elementRef.nativeElement, 'scroll').pipe(
      filter(() => !this.isPostOutletActivated),
      untilDestroyed(this),
    ).subscribe(() => this.scrollPosition = this.elementRef.nativeElement.scrollTop);
  }

  public loadMore(): void {
    this.feedPageService.loadMorePosts();
  }

  public postLinkFn: (post: PostsListItem) => unknown[] = (post) => {
    return ['./', { outlets: { primary: null, post: [HubRoute.Post, post.owner, post.uuid] } }];
  }

  public trackByPostId: TrackByFunction<Post> = ({}, { uuid }) => uuid;

  public onPostOutletActivate(): void {
    this.isPostOutletActivated = true;
    this.changeDetectorRef.detectChanges();

    this.setScrollTop(0);
  }

  public onPostOutletDeactivate(): void {
    this.isPostOutletActivated = false;
    this.changeDetectorRef.detectChanges();

    this.setScrollTop(this.scrollPosition);
  }

  private setScrollTop(value: number): void {
    timer(0).pipe(
      untilDestroyed(this),
    ).subscribe(() => this.elementRef.nativeElement.scrollTop = value || 0);
  }
}

import { ChangeDetectionStrategy, Component, OnInit, TrackByFunction } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from 'decentr-js';

import { HubPostsService } from '../../services';
import { FeedPageService } from './feed-page.service';
import { PostWithAuthor } from '../../models/post';
import { HUB_HEADER_ACTIONS_SLOT } from '../../components/hub-header';
import { AppRoute } from '../../../app-route';
import { HubRoute } from '../../hub-route';

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
  public headerActionsSlotName = HUB_HEADER_ACTIONS_SLOT;

  public appRoute: typeof AppRoute = AppRoute;
  public hubRoute: typeof HubRoute = HubRoute;

  public isLoading$: Observable<boolean>;
  public posts$: Observable<PostWithAuthor[]>;

  constructor(private feedPageService: HubPostsService) {
  }

  public ngOnInit() {
    this.posts$ = this.feedPageService.posts$;

    this.isLoading$ = this.feedPageService.isLoading$;

    this.feedPageService.loadInitialPosts();
  }

  public loadMore(): void {
    this.feedPageService.loadMorePosts();
  }

  public trackByPostId: TrackByFunction<Post> = ({}, { uuid }) => uuid;
}

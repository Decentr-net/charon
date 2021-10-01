import { ChangeDetectionStrategy, Component, Input, OnInit, TrackByFunction } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Post, PostCategory } from 'decentr-js';

import { PostsListItem } from '@core/services';
import { HubPostsService } from '../../services';
import { HubRelatedPostsService } from './hub-related-posts.service';

@Component({
  selector: 'app-hub-related-posts',
  templateUrl: './hub-related-posts.component.html',
  styleUrls: ['./hub-related-posts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    HubRelatedPostsService,
    {
      provide: HubPostsService,
      useExisting: HubRelatedPostsService,
    },
  ],
})
export class HubRelatedPostsComponent implements OnInit {
  @Input() public set category(value: PostCategory) {
    this.hubRelatedPostsService.setCategory(value);
  }

  @Input() public set displayCount(value: number) {
    this.hubRelatedPostsService.setLoadingCount(value + 1);
    this.postsCount = value;
  }

  @Input() public set excludeID(value: Post['uuid']) {
    this.excludeID$.next(value);
  }

  @Input() public routerLinkFn: (post: Post) => string[];

  public isLoading$: Observable<boolean>;
  public posts$: Observable<PostsListItem[]>;

  public trackByPostId: TrackByFunction<Post> = this.hubRelatedPostsService.trackByPostId;

  public postsCount: number = 4;

  private excludeID$: BehaviorSubject<Post['uuid']> = new BehaviorSubject(void 0);

  constructor(private hubRelatedPostsService: HubRelatedPostsService) {
  }

  public ngOnInit(): void {
    this.posts$ = this.excludeID$.pipe(
      switchMap((excludeId) => this.hubRelatedPostsService.posts$.pipe(
      map((posts) => {
        return posts.filter(({ uuid }) => uuid !== excludeId)
          .slice(0, this.postsCount);
      }),
    )));

    this.isLoading$ = this.hubRelatedPostsService.isLoading$;

    this.hubRelatedPostsService.loadInitialPosts();

    this.routerLinkFn = this.routerLinkFn || (() => ['./']);
  }
}

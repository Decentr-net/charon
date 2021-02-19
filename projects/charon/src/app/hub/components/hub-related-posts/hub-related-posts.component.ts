import { ChangeDetectionStrategy, Component, Input, OnInit, TrackByFunction } from '@angular/core';
import { Observable } from 'rxjs';
import { Post, PostCategory } from 'decentr-js';

import { HubPostsService } from '../../services';
import { PostWithLike } from '../../models/post';
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
    this.hubRelatedPostsService.setLoadingCount(value);
  };

  @Input() public routerLinkFn: (post: Post) => string[] = () => ['./'];

  public isLoading$: Observable<boolean>;
  public posts$: Observable<PostWithLike[]>;

  public trackByPostId: TrackByFunction<Post> = this.hubRelatedPostsService.trackByPostId;

  constructor(private hubRelatedPostsService: HubRelatedPostsService) {
  }

  public ngOnInit(): void {
    this.posts$ = this.hubRelatedPostsService.posts$;

    this.isLoading$ = this.hubRelatedPostsService.isLoading$;

    this.hubRelatedPostsService.loadMorePosts();
  }
}

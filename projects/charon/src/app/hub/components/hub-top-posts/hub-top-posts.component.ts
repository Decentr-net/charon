import { ChangeDetectionStrategy, Component, Input, OnInit, TrackByFunction } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Post, PostCategory } from 'decentr-js';

import { HubPostsService } from '../../services';
import { HubTopPostsService } from './hub-top-posts.service';
import { PostWithLike } from '../../models/post';

@UntilDestroy()
@Component({
  selector: 'app-hub-top-posts',
  templateUrl: './hub-top-posts.component.html',
  styleUrls: ['./hub-top-posts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    HubTopPostsService,
    {
      provide: HubPostsService,
      useExisting: HubTopPostsService,
    },
  ],
})
export class HubTopPostsComponent implements OnInit {
  @Input() public set category(value: PostCategory) {
    this.category$.next(value);
  }

  public isLoading$: Observable<boolean>;
  public posts$: Observable<PostWithLike[]>;
  public canLoadMore$: Observable<boolean>;

  public category$: ReplaySubject<PostCategory> = new ReplaySubject(1);

  constructor(private hubTopPostsService: HubTopPostsService) {
  }

  public ngOnInit(): void {
    this.posts$ = this.hubTopPostsService.posts$;

    this.isLoading$ = this.hubTopPostsService.isLoading$;

    this.canLoadMore$ = this.hubTopPostsService.canLoadMore$;

    this.category$.pipe(
      untilDestroyed(this)
    ).subscribe((category) => {
      console.log(category);
      this.hubTopPostsService.setCategory(category);
    });
  }

  public loadMore(): void {
    this.hubTopPostsService.loadMorePosts();
  }

  public trackByPostId: TrackByFunction<Post> = ({}, { uuid }) => uuid;
}

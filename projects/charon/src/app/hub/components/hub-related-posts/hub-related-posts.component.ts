import { ChangeDetectionStrategy, Component, Input, OnInit, TrackByFunction } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Post, PostCategory } from 'decentr-js';

import { HubPostsService } from '../../services';
import { PostWithLike } from '../../models/post';
import { HubRelatedPostsService } from './hub-related-posts.service';

@UntilDestroy()
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
    this.category$.next(value);
  }

  @Input() public displayCount: number = 4;

  public isLoading$: Observable<boolean>;
  public posts$: Observable<PostWithLike[]>;

  public category$: ReplaySubject<PostCategory> = new ReplaySubject(1);

  public trackByPostId: TrackByFunction<Post> = this.hubRelatedPostsService.trackByPostId;

  constructor(private hubRelatedPostsService: HubRelatedPostsService) {
  }

  public ngOnInit(): void {
    this.posts$ = this.hubRelatedPostsService.posts$;

    this.isLoading$ = this.hubRelatedPostsService.isLoading$;

    this.category$.pipe(
      untilDestroyed(this)
    ).subscribe((category) => {
      this.hubRelatedPostsService.setCategory(category);
    });
  }
}

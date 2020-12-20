import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  OnInit,
  TemplateRef,
  TrackByFunction,
} from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Post } from 'decentr-js';

import { HubPostsService } from '../../services';
import { PostWithAuthor } from '../../models/post';

@Component({
  selector: 'app-hub-wall-posts',
  templateUrl: './hub-wall-posts.component.html',
  styleUrls: ['./hub-wall-posts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubWallPostsComponent implements OnInit {
  public isLoading$: Observable<boolean>;
  public posts$: Observable<PostWithAuthor[]>;
  public canLoadMore$: Observable<boolean>;

  @ContentChild('noPosts') public noPostsTemplate: TemplateRef<void>;

  constructor(private hubPostsService: HubPostsService) {
  }

  public ngOnInit() {
    this.posts$ = this.hubPostsService.posts$.pipe(
      shareReplay(1),
    );

    this.isLoading$ = this.hubPostsService.isLoading$.pipe(
      shareReplay(1),
    );

    this.canLoadMore$ = this.hubPostsService.canLoadMore$;

    this.loadMore();
  }

  public loadMore(): void {
    this.hubPostsService.loadMorePosts();
  }

  public trackByPostId: TrackByFunction<Post> = ({}, { uuid }) => uuid;
}

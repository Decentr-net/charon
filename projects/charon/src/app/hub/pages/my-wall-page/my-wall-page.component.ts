import { ChangeDetectionStrategy, Component, OnInit, TrackByFunction } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from 'decentr-js';

import { MyWallPageService } from './my-wall-page.service';

@Component({
  selector: 'app-my-wall-page',
  templateUrl: './my-wall-page.component.html',
  styleUrls: ['./my-wall-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    MyWallPageService,
  ],
})
export class MyWallPageComponent implements OnInit {
  public isLoading$: Observable<boolean>;
  public posts$: Observable<Post[]>;
  public canLoadMore$: Observable<boolean>;

  private readonly loadingCount: number = 4;

  constructor(private myWallPageService: MyWallPageService) {
  }

  public ngOnInit() {
    this.posts$ = this.myWallPageService.posts$;

    this.isLoading$ = this.myWallPageService.isLoading$;

    this.canLoadMore$ = this.myWallPageService.canLoadMore$;

    this.loadMore();
  }

  public loadMore(): void {
    this.myWallPageService.loadMorePosts(this.loadingCount);
  }

  public trackByPostId: TrackByFunction<Post> = ({}, { uuid }) => uuid;
}
